import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User.model';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { userId, code } = await req.json();
    
    if (!userId || !code) {
      return NextResponse.json(
        { error: 'Thiếu thông tin xác thực' },
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
    
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Mã xác thực không đúng' },
        { status: 400 }
      );
    }
    
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return NextResponse.json(
        { error: 'Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại.' },
        { status: 400 }
      );
    }
    
    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Xác thực email thành công!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: true,
      },
    });
    
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}