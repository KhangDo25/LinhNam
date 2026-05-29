import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { jsonError } from "@/lib/api-response";
import { generateVerificationCode } from "@/lib/auth-validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body as { userId?: string };
    if (!userId) return jsonError("Thiếu userId.");

    await connectDB();

    const user = await User.findById(userId);
    if (!user) return jsonError("Không tìm thấy tài khoản.", 404);
    if (user.emailVerified) return jsonError("Email đã được xác thực.");

    const code = generateVerificationCode();
    user.verificationCode = code;
    await user.save();

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json({
      ok: true,
      ...(isDev ? { demoCode: code } : {}),
    });
  } catch (error) {
    console.error("[auth/resend-code]", error);
    return jsonError("Gửi lại mã thất bại.", 500);
  }
}
