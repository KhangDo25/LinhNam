import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User.model';
import { verifySession } from '@/lib/auth-session';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: Request) {
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
      target.balance = (target.balance ?? 0) + Math.floor(amount);
      await target.save();
      return NextResponse.json({
        success: true,
        balance: target.balance,
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

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại.' }, { status: 404 });
    }

    user.balance += Math.floor(amount);
    await user.save();

    return NextResponse.json({
      success: true,
      balance: user.balance,
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
