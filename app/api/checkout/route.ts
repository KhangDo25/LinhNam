import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User.model";
import Order from "@/lib/models/Order.model";
import { verifySession } from "@/lib/auth-session";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { shopItems } from "@/data/shop";

export async function POST(req: Request) {
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

    const orderLines: {
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }[] = [];
    let total = 0;

    for (const item of items) {
      const product = shopItems.find((p) => p.id === item.productId);
      if (!product || product.priceValue === 0) {
        return NextResponse.json(
          { error: `Sản phẩm không hợp lệ: ${item.productId}` },
          { status: 400 }
        );
      }
      const lineTotal = product.priceValue * item.quantity;
      orderLines.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
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

    user.balance -= total;
    user.cart = [];
    await user.save();

    const order = await Order.create({
      userId: user._id,
      items: orderLines,
      total,
      status: "paid",
      paymentMethod: "linh_thach",
      paymentStatus: "paid",
    });

    user.orderHistory.push(order._id);
    await user.save();

    try {
      await sendOrderConfirmationEmail(
        user.email,
        user.name,
        order._id.toString(),
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
      orderId: order._id.toString(),
      balance: user.balance,
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
