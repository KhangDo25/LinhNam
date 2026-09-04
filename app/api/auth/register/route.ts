import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User.model';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, validateName } from '@/lib/auth-validation';

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
    
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Đăng ký thành công',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}