// Script tạo tài khoản admin:  npx tsx scripts/make-admin.ts <email> [name] [password]
// Nếu user đã tồn tại -> promote lên admin (+ reset mật khẩu nếu có truyền).
// Nếu chưa có -> tạo mới (verified sẵn) với 1.000 LT.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Nạp .env thủ công để chạy được bằng `npx tsx` mà không cần dotenv
try {
  const envPath = path.resolve(process.cwd(), ".env");
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
} catch {
  // bỏ qua, kiểm tra MONGODB_URI bên dưới sẽ báo lỗi
}

const MONGODB_URI = process.env.MONGODB_URI;
const email = (process.argv[2] || "").toLowerCase().trim();
const name = process.argv[3] || "Admin Linh Nam";
const password = process.argv[4] || `Admin@${Date.now().toString().slice(-6)}!`;

if (!MONGODB_URI) {
  console.error("Thiếu MONGODB_URI trong .env");
  process.exit(1);
}
if (!email || !email.includes("@")) {
  console.error("Dùng: npx tsx scripts/make-admin.ts <email> [name] [password]");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI!);
  const col = mongoose.connection.collection("users");
  const existing = await col.findOne({ email });

  if (existing) {
    const update: Record<string, unknown> = {
      role: "admin",
      emailVerified: true,
      loginAttempts: 0,
      lockUntil: null,
    };
    if (process.argv[4]) {
      update.password = await bcrypt.hash(password, 10);
    }
    await col.updateOne({ _id: existing._id }, { $set: update });
    console.log(`Đã promote ${email} lên ADMIN.`);
    if (process.argv[4]) console.log(`Mật khẩu mới: ${password}`);
    else console.log("Giữ nguyên mật khẩu cũ.");
  } else {
    const hash = await bcrypt.hash(password, 10);
    await col.insertOne({
      name,
      email,
      password: hash,
      role: "admin",
      balance: 1000,
      emailVerified: true,
      verificationCode: null,
      verificationCodeExpires: null,
      loginAttempts: 0,
      lockUntil: null,
      cart: [],
      orderHistory: [],
      bookmarks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Đã tạo ADMIN ${email}`);
    console.log(`Mật khẩu: ${password}`);
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
