import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User.model';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth-session';
import { validateEmail, validatePassword } from '@/lib/auth-validation';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();
    
    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    if (user.isLocked && user.isLocked()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Tài khoản bị khóa. Vui lòng thử lại sau ${remainingTime} phút.` },
        { status: 401 }
      );
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      user.loginAttempts += 1;
      
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      
      await user.save();
      
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();
    
    const token = createSession(user._id.toString());
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: 'Đăng nhập thành công',
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}