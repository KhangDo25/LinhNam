import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, toPublicUser } from "@/lib/models/User";
import { getSessionUserId } from "@/lib/auth-session";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ ok: true, user: null, balance: 0 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      const res = NextResponse.json({ ok: true, user: null, balance: 0 });
      res.cookies.delete("linh-nam-auth");
      return res;
    }

    return NextResponse.json({
      ok: true,
      user: toPublicUser(user),
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
