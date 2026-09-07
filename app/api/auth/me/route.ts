import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User.model";
import { verifySession } from "@/lib/auth-session";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ ok: true, user: null, balance: 0 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ ok: true, user: null, balance: 0 });
    }

    await connectDB();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ ok: true, user: null, balance: 0 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
      },
      balance: user.balance,
    });
  } catch (error) {
    console.error("[auth/me]", error);
    return NextResponse.json(
      { ok: false, error: "Không đọc được phiên đăng nhập." },
      { status: 500 }
    );
  }
}
