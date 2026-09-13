import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User.model";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/admin-auth";

// Admin: liệt kê thành viên (ẩn password, tìm kiếm, phân trang)
export async function GET(req: Request) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20"), 1), 100);

  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -verificationCode")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return NextResponse.json({
    success: true,
    users: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: (u as { role?: string }).role ?? "user",
      balance: u.balance ?? 0,
      emailVerified: u.emailVerified,
      loginAttempts: u.loginAttempts ?? 0,
      locked: Boolean(u.lockUntil && u.lockUntil > new Date()),
      createdAt: u.createdAt?.toISOString?.(),
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// Admin: sửa thành viên (tên, role, balance cộng/trừ, mở khóa, reset mật khẩu)
export async function PATCH(req: Request) {
  const { error, user: admin } = await requireAdmin(req);
  if (error) return error;

  const body = (await req.json()) as {
    userId?: string;
    name?: string;
    role?: "user" | "admin";
    balanceDelta?: number;
    unlock?: boolean;
    newPassword?: string;
  };
  if (!body.userId) {
    return NextResponse.json({ error: "Thiếu userId." }, { status: 400 });
  }
  await connectDB();
  const target = await User.findById(body.userId);
  if (!target) {
    return NextResponse.json({ error: "Thành viên không tồn tại." }, { status: 404 });
  }

  if (body.name !== undefined) {
    const name = body.name.trim();
    if (name.length < 2 || name.length > 60) {
      return NextResponse.json({ error: "Tên không hợp lệ." }, { status: 400 });
    }
    target.name = name;
  }
  if (body.role !== undefined) {
    if (!["user", "admin"].includes(body.role)) {
      return NextResponse.json({ error: "Role không hợp lệ." }, { status: 400 });
    }
    // Không cho tự hạ quyền chính mình để tránh khóa admin
    if (target._id.toString() === admin._id.toString() && body.role !== "admin") {
      return NextResponse.json({ error: "Không thể tự hạ quyền chính mình." }, { status: 400 });
    }
    target.role = body.role;
  }
  if (body.balanceDelta !== undefined) {
    if (!Number.isFinite(body.balanceDelta)) {
      return NextResponse.json({ error: "Số LT không hợp lệ." }, { status: 400 });
    }
    target.balance = Math.max(0, (target.balance ?? 0) + Math.floor(body.balanceDelta));
  }
  if (body.unlock) {
    target.loginAttempts = 0;
    target.lockUntil = null;
  }
  if (body.newPassword !== undefined && body.newPassword !== "") {
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: "Mật khẩu mới tối thiểu 8 ký tự." }, { status: 400 });
    }
    target.password = await bcrypt.hash(body.newPassword, 10);
  }

  await target.save();
  return NextResponse.json({
    success: true,
    user: {
      id: target._id.toString(),
      name: target.name,
      email: target.email,
      role: target.role,
      balance: target.balance,
      emailVerified: target.emailVerified,
    },
  });
}

// Admin: xóa thành viên (không cho xóa chính mình)
export async function DELETE(req: Request) {
  const { error, user: admin } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Thiếu userId." }, { status: 400 });
  }
  if (userId === admin._id.toString()) {
    return NextResponse.json({ error: "Không thể xóa chính mình." }, { status: 400 });
  }
  await connectDB();
  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) {
    return NextResponse.json({ error: "Thành viên không tồn tại." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}