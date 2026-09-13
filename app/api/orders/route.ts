import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order.model';
import { verifySession } from '@/lib/auth-session';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === '1';

    // Admin xem toàn bộ đơn (có phân trang nhẹ)
    if (all) {
      const { error } = await requireAdmin(req);
      if (error) return error;
      const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
      const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email')
        .lean();
      return NextResponse.json({ success: true, orders });
    }

    const orders = await Order.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

// Admin cập nhật trạng thái đơn hàng
export async function PATCH(req: Request) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = (await req.json()) as { orderId?: string; status?: string };
  const allowed = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!body.orderId || !body.status || !allowed.includes(body.status)) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = await Order.findByIdAndUpdate(body.orderId, { $set: { status: body.status as any } }, { new: true });
  if (!order) {
    return NextResponse.json({ error: 'Đơn hàng không tồn tại.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, order });
}