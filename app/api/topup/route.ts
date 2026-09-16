import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User.model';
import { verifySession } from '@/lib/auth-session';
import { requireAdmin } from '@/lib/admin-auth';
import { apiLimiter, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const rl = apiLimiter.check(req);
  if (!rl.success) return rateLimitResponse(rl.resetMs);
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập.' }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: 'Phiên đăng nhập hết hạn.' }, { status: 401 });
    }

    const { amount, targetEmail } = (await req.json()) as {
      amount?: number;
      targetEmail?: string;
    };

    if (!amount || typeof amount !== 'number' || !Number.isFinite(amount)) {
      return NextResponse.json({ error: 'Số tiền không hợp lệ.' }, { status: 400 });
    }

    // Admin nạp hộ user khác bằng email (không giới hạn min/max)
    if (targetEmail) {
      const { error: adminError, user: admin } = await requireAdmin(req);
      if (adminError) return adminError;
      if (amount < 1 || amount > 100_000_000) {
        return NextResponse.json({ error: 'Số tiền không hợp lệ.' }, { status: 400 });
      }
      const target = await User.findOne({ email: targetEmail.toLowerCase() });
      if (!target) {
        return NextResponse.json({ error: 'Email nhận tiền không tồn tại.' }, { status: 404 });
      }
      // $inc nguyên tử để 2 admin nạp đồng thời không mất mát số dư.
      const updated = await User.findByIdAndUpdate(
        target._id,
        { $inc: { balance: Math.floor(amount) } },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        balance: updated?.balance ?? target.balance,
        message: `Đã nạp ${Math.floor(amount).toLocaleString('vi-VN')} LT cho ${target.email} (bởi admin ${admin.email}).`,
      });
    }

    // User tự nạp cho chính mình
    if (amount < 10000) {
      return NextResponse.json({ error: 'Số tiền nạp tối thiểu là 10.000 Linh Thạch.' }, { status: 400 });
    }

    if (amount > 100_000_000) {
      return NextResponse.json({ error: 'Số tiền nạp tối đa là 100.000.000 Linh Thạch.' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $inc: { balance: Math.floor(amount) } },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      balance: updatedUser.balance,
      message: `Nạp thành công ${Math.floor(amount).toLocaleString('vi-VN')} Linh Thạch!`,
    });
  } catch (error) {
    console.error('Topup error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
