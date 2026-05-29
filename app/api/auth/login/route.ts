import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, toPublicUser } from "@/lib/models/User";
import { jsonError } from "@/lib/api-response";
import { validateEmail } from "@/lib/auth-validation";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    const emailErr = validateEmail(email ?? "");
    if (emailErr) return jsonError(emailErr);
    if (!password) return jsonError("Vui lòng nhập mật khẩu.");

    await connectDB();

    const trimmedEmail = email!.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) return jsonError("Email hoặc mật khẩu không đúng.", 401);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return jsonError("Email hoặc mật khẩu không đúng.", 401);

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          ok: false,
          needsVerification: true,
          userId: user._id.toString(),
          error: "Tài khoản chưa xác thực email.",
        },
        { status: 403 }
      );
    }

    const token = createSessionToken(user._id.toString());
    const res = NextResponse.json({
      ok: true,
      user: toPublicUser(user),
      balance: user.balance,
    });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  } catch (error) {
    console.error("[auth/login]", error);
    return jsonError("Đăng nhập thất bại.", 500);
  }
}
