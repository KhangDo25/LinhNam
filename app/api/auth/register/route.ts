import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User.model';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, validateName } from '@/lib/auth-validation';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { name, email, password } = await req.json();
    
    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }
    
    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được đăng ký' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
    
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      balance: 0, 
      emailVerified: false,
      verificationCode,
      verificationCodeExpires,
      loginAttempts: 0,
      lockUntil: null,
      cart: [],
      orderHistory: [],
      bookmarks: [],
    });
    
    let emailSent = false;
    let emailErrorMessage: string | null = null;
    
    try {
      const emailResult = await sendVerificationEmail(email, verificationCode, name);
      if (emailResult.success) {
        emailSent = true;
      } else {
        emailErrorMessage = emailResult.error || 'Không thể gửi email xác thực';
        console.warn('⚠️ Không thể gửi email xác thực:', emailErrorMessage);
      }
    } catch (error) {
      console.warn('⚠️ Lỗi gửi email:', error);
      emailErrorMessage = 'Không thể gửi email xác thực. Vui lòng kiểm tra lại email hoặc liên hệ hỗ trợ.';
    }
    
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    if (emailSent) {
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        userId: user._id,
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        requiresVerification: true,
      }, { status: 201 });
    }
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      userId: user._id,
      message: 'Đăng ký thành công! Tuy nhiên không thể gửi email xác thực.',
      requiresVerification: true,
      emailError: emailErrorMessage || 'Không thể gửi email xác thực. Vui lòng liên hệ hỗ trợ.',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}