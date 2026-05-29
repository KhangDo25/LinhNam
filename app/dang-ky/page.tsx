"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/auth/auth-form-shell";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { validatePasswordMatch } from "@/lib/auth-validation";

export default function DangKyPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchErr = validatePasswordMatch(password, confirm);
    if (matchErr) {
      setError(matchErr);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await register(name, email, password);
      if (!result.ok) {
        setError(result.error ?? "Đăng ký thất bại.");
        return;
      }
      if (result.demoCode) {
        sessionStorage.setItem("linh-nam-demo-otp", result.demoCode);
      }
      router.push("/xac-thuc");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormShell
      title="Tạo tài khoản"
      subtitle="Mật khẩu: tối thiểu 8 ký tự, có chữ hoa, chữ thường và số. Sau đăng ký cần xác thực email (OTP demo)."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="text-gold hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-bone/60">Họ tên</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-base text-bone focus:border-gold outline-none min-h-[48px]"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-bone/60">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-base text-bone focus:border-gold outline-none min-h-[48px]"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-bone/60">Mật khẩu</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-base text-bone focus:border-gold outline-none min-h-[48px]"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-bone/60">Xác nhận mật khẩu</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-base text-bone focus:border-gold outline-none min-h-[48px]"
          />
        </label>
        {error && <p className="text-sm text-crimson">{error}</p>}
        <Button type="submit" variant="primary" className="w-full min-h-[48px]" disabled={submitting}>
          {submitting ? "Đang xử lý…" : "Đăng ký"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
