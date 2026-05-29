import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";
import { jsonError } from "@/lib/api-response";
import { getSessionUserId } from "@/lib/auth-session";
import { shopItems } from "@/data/shop";

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return jsonError("Vui lòng đăng nhập.", 401);

    const body = await request.json();
    const { items } = body as {
      items?: { productId: string; quantity: number }[];
    };

    if (!items?.length) return jsonError("Giỏ hàng trống.");

    let total = 0;
    for (const line of items) {
      const product = shopItems.find((p) => p.id === line.productId);
      if (!product || product.priceValue === 0) continue;
      total += product.priceValue * line.quantity;
    }

    if (total <= 0) return jsonError("Không có sản phẩm hợp lệ để thanh toán.");

    await connectDB();

    const user = await User.findById(userId);
    if (!user) return jsonError("Không tìm thấy tài khoản.", 404);
    if (!user.emailVerified) {
      return jsonError("Vui lòng xác thực email trước khi mua.", 403);
    }
    if (user.balance < total) {
      return jsonError("Không đủ Linh Thạch.");
    }

    user.balance -= total;
    await user.save();

    const order = await Order.create({
      userId: user._id,
      items,
      total,
      status: "paid",
    });

    return NextResponse.json({
      ok: true,
      orderId: order._id.toString(),
      balance: user.balance,
    });
  } catch (error) {
    console.error("[orders/checkout]", error);
    return jsonError("Thanh toán thất bại.", 500);
  }
}
