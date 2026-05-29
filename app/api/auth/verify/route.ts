import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, toPublicUser } from "@/lib/models/User";
import { jsonError } from "@/lib/api-response";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, code } = body as { userId?: string; code?: string };

    if (!userId) return jsonError("Thiếu userId.");
    const trimmed = (code ?? "").trim();
    if (!/^\d{6}$/.test(trimmed)) {
      return jsonError("Mã xác thực gồm 6 chữ số.");
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) return jsonError("Không tìm thấy tài khoản.", 404);

    if (user.emailVerified) {
      return jsonError("Email đã được xác thực.");
    }

    if (user.verificationCode !== trimmed) {
      return jsonError("Mã xác thực không đúng.");
    }

    user.emailVerified = true;
    user.verificationCode = null;
    await user.save();

    const token = createSessionToken(user._id.toString());
    const res = NextResponse.json({
      ok: true,
      user: toPublicUser(user),
      balance: user.balance,
    });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  } catch (error) {
    console.error("[auth/verify]", error);
    return jsonError("Xác thực thất bại.", 500);
  }
}
