import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User.model';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin user' },
        { status: 400 }
      );
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Tài khoản không tồn tại' },
        { status: 404 }
      );
    }
    
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Tài khoản đã được xác thực' },
        { status: 400 }
      );
    }
    
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    user.verificationCode = newCode;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    
    const emailResult = await sendVerificationEmail(user.email, newCode, user.name);
    
    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Không thể gửi email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Đã gửi lại mã xác thực!',
      code: newCode,
    });
    
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}