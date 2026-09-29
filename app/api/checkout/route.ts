import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User.model";
import Order from "@/lib/models/Order.model";
import { verifySession } from "@/lib/auth-session";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { getShopCatalog } from "@/app/api/products/route";
import ProductOverride from "@/lib/models/ProductOverride.model";
import { apiLimiter, rateLimitResponse } from "@/lib/rate-limit";

/**
 * Lỗi nghiệp vụ trong checkout: throw ra để withTransaction ROLLBACK toàn bộ
 * (balance + stock + order + order history), rồi trả về message thân thiện.
 */
class CheckoutError extends Error {
  readonly status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "CheckoutError";
    this.status = status;
  }
}

export async function POST(req: Request) {
  const rl = apiLimiter.check(req);
  if (!rl.success) return rateLimitResponse(rl.resetMs);
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { items } = (await req.json()) as {
      items?: { productId: string; quantity: number }[];
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length > 50) {
      return NextResponse.json({ error: "Giỏ hàng không hợp lệ." }, { status: 400 });
    }
    for (const item of items) {
      if (
        typeof item?.productId !== "string" ||
        !/^[a-z0-9-]+$/i.test(item.productId) ||
        item.productId.length > 64
      ) {
        return NextResponse.json(
          { error: `Sản phẩm không hợp lệ: ${String(item?.productId ?? "").slice(0, 32)}` },
          { status: 400 }
        );
      }
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Vui lòng xác thực email trước khi mua." },
        { status: 403 }
      );
    }

    // Giá lấy từ catalog thực tế (đã gồm giá admin chỉnh), không tin giá client
    const catalog = await getShopCatalog();
    const catalogMap = new Map(catalog.map((p) => [p.id, p]));

    const orderLines: {
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }[] = [];
    let total = 0;

    for (const item of items) {
      const product = catalogMap.get(item.productId);
      const qty = Math.floor(item.quantity);
      if (!product || product.priceValue === 0 || !qty || qty < 1 || qty > 99) {
        return NextResponse.json(
          { error: `Sản phẩm không hợp lệ: ${item.productId}` },
          { status: 400 }
        );
      }
      // Kiểm tra tồn kho do admin đặt (-1 = vô hạn)
      if (product.stock >= 0 && product.stock < qty) {
        return NextResponse.json(
          { error: `${product.name} chỉ còn ${product.stock} cái.` },
          { status: 400 }
        );
      }
      const lineTotal = product.priceValue * qty;
      orderLines.push({
        productId: product.id,
        name: product.name,
        quantity: qty,
        price: product.priceValue,
      });
      total += lineTotal;
    }

    if (user.balance < total) {
      return NextResponse.json(
        {
          error: `Số dư không đủ. Cần ${total.toLocaleString("vi-VN")} LT, hiện có ${user.balance.toLocaleString("vi-VN")} LT.`,
        },
        { status: 400 }
      );
    }

    // ===== TRANSACTION: mọi bước bên dưới cùng commit hoặc cùng rollback =====
    // Nếu stock fail (hoặc bất kỳ bước nào fail) → ROLLBACK EVERYTHING:
    // balance được hoàn, không tạo order, không tạo order history, trả lỗi.
    const session = await mongoose.startSession();
    let orderId = "";
    let newBalance = user.balance;
    try {
      await session.withTransaction(async () => {
        // 7. Trừ tiền nguyên tử: 2 request song song không thể cùng trừ quá số dư.
        const debited = await User.findOneAndUpdate(
          { _id: user._id, balance: { $gte: total } },
          { $set: { cart: [] }, $inc: { balance: -total } },
          { new: true, session }
        );
        if (!debited) {
          throw new CheckoutError(
            "Số dư không đủ hoặc đơn vừa được xử lý. Vui lòng thử lại."
          );
        }
        newBalance = debited.balance;

        // 8. Trừ kho nguyên tử CÓ ĐIỀU KIỆN (stock >= quantity) + KIỂM TRA KẾT QUẢ.
        //    Không đọc-điều-kiện-rồi-ghi (không atomic): một câu update có điều kiện là 1 thao tác nguyên tử.
        //    Nếu không trừ được stock → throw → ROLLBACK toàn bộ (hoàn balance, không tạo order/history).
        for (const line of orderLines) {
          const stockUpdate = await ProductOverride.updateOne(
            { productId: line.productId, stock: { $gte: line.quantity } },
            { $inc: { stock: -line.quantity } },
            { session }
          );
          if (stockUpdate.matchedCount > 0) continue; // đã trừ thành công

          // Không match → chỉ hợp lệ khi sản phẩm KHÔNG giới hạn
          // (không có override, hoặc override.stock = -1 = vô hạn).
          // Còn override có stock >= 0 mà không match → đã hết/không đủ → rollback.
          const override = await ProductOverride.findOne(
            { productId: line.productId },
            null,
            { session }
          ).lean();
          if (override && override.stock >= 0) {
            throw new CheckoutError(
              `${line.name} đã hết hàng hoặc không đủ số lượng. Vui lòng thử lại.`
            );
          }
        }

        // 9. Tạo order (trong transaction — rollback nếu các bước sau fail)
        const created = await Order.create(
          [
            {
              userId: user._id,
              items: orderLines,
              total,
              status: "paid",
              paymentMethod: "linh_thach",
              paymentStatus: "paid",
            },
          ],
          { session }
        );
        orderId = created[0]._id.toString();

        // 10. Cập nhật order history nguyên tử (thay vì user.save() ghi đè doc cũ)
        await User.updateOne(
          { _id: user._id },
          { $push: { orderHistory: created[0]._id } },
          { session }
        );
      });
    } catch (txnError) {
      if (txnError instanceof CheckoutError) {
        return NextResponse.json(
          { error: txnError.message },
          { status: txnError.status }
        );
      }
      throw txnError;
    } finally {
      await session.endSession();
    }

    try {
      await sendOrderConfirmationEmail(
        user.email,
        user.name,
        orderId,
        total,
        orderLines.map((l) => ({
          name: l.name,
          quantity: l.quantity,
          price: l.price * l.quantity,
        }))
      );
    } catch (emailError) {
      console.warn("⚠️ Không thể gửi email xác nhận:", emailError);
    }

    return NextResponse.json({
      success: true,
      orderId,
      balance: newBalance,
      message: "Thanh toán thành công!",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
