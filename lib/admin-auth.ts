import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User.model";
import { verifySession } from "@/lib/auth-session";

export function isAdminEmail(email: string): boolean {
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
export async function requireAdmin(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return {
      error: NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 }),
      user: null,
    };
  }
  const payload = verifySession(token);
  if (!payload) {
    return {
      error: NextResponse.json({ error: "Phiên đăng nhập hết hạn." }, { status: 401 }),
      user: null,
    };
  }
  await connectDB();
  const user = await User.findById(payload.userId);
  if (!user) {
    return {
      error: NextResponse.json({ error: "Tài khoản không tồn tại." }, { status: 404 }),
      user: null,
    };
  }
  if (user.role !== "admin" && isAdminEmail(user.email)) {
    user.role = "admin";
    await user.save();
  }
  if (user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Không có quyền admin." }, { status: 403 }),
      user: null,
    };
  }
  return { error: null, user };
}