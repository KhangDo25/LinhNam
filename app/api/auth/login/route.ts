import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/lib/models/User.model";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth-session";
import { validateEmail } from "@/lib/auth-validation";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const emailError = validateEmail(email ?? "");
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Vui lòng nhập mật khẩu." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const raw = (await mongoose.connection
      .collection("users")
      .findOne({ email: normalizedEmail })) as null | {
      _id: { toString(): string };
      password?: string;
      passwordHash?: string;
    };

    if (!raw) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    const hash: string | undefined = raw.password ?? raw.passwordHash;
    if (!hash || typeof hash !== "string") {
      console.error(
        `[login] user ${normalizedEmail} thiếu hash mật khẩu (password & passwordHash đều undefined).`
      );
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }
    if (!user.password && raw.passwordHash) {
      user.password = raw.passwordHash;
    }

    if (user.isLocked?.()) {
      const remainingTime = Math.ceil(
        (user.lockUntil!.getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          error: `Tài khoản bị khóa. Vui lòng thử lại sau ${remainingTime} phút.`,
        },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, hash);
    if (!isValid) {
      const attempts = (user.loginAttempts ?? 0) + 1;
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            loginAttempts: attempts,
            ...(attempts >= MAX_LOGIN_ATTEMPTS
              ? { lockUntil: new Date(Date.now() + LOCK_TIME) }
              : {}),
          },
        }
      );
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error:
            "Tài khoản chưa được xác thực email. Vui lòng kiểm tra email để xác thực.",
          needsVerification: true,
          userId: user._id.toString(),
        },
        { status: 403 }
      );
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save().catch(() => User.updateOne(
      { _id: user._id },
      { $set: { loginAttempts: 0, lockUntil: null } },
    ));

    const token = createSession(user._id.toString());

    const res = NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        role: (user as { role?: string }).role ?? "user",
        createdAt: user.createdAt.toISOString(),
      },
      balance: user.balance ?? 0,
      message: "Đăng nhập thành công",
    });
    // Cookie cho proxy.ts (middleware) đọc — client vẫn dùng Bearer token.
    res.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
