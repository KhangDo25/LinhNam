import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { jsonError } from "@/lib/api-response";
import {
  validateEmail,
  validateName,
  validatePassword,
  generateVerificationCode,
} from "@/lib/auth-validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    const nameErr = validateName(name ?? "");
    if (nameErr) return jsonError(nameErr);
    const emailErr = validateEmail(email ?? "");
    if (emailErr) return jsonError(emailErr);
    const passErr = validatePassword(password ?? "");
    if (passErr) return jsonError(passErr);

    await connectDB();

    const trimmedEmail = email!.trim().toLowerCase();
    const exists = await User.findOne({ email: trimmedEmail }).lean();
    if (exists) return jsonError("Email đã được đăng ký.");

    const code = generateVerificationCode();
    const passwordHash = await bcrypt.hash(password!, 12);

    const user = await User.create({
      name: name!.trim(),
      email: trimmedEmail,
      passwordHash,
      emailVerified: false,
      verificationCode: code,
    });

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json({
      ok: true,
      userId: user._id.toString(),
      ...(isDev ? { demoCode: code } : {}),
    });
  } catch (error) {
    console.error("[auth/register]", error);
    const message =
      error instanceof Error ? error.message : "Đăng ký thất bại.";
    return jsonError(message, 500);
  }
}
