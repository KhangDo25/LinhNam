"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/auth/auth-form-shell";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { getLoginLockoutMessage } from "@/lib/auth-validation";

export default function DangNhapPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lock = getLoginLockoutMessage();
    if (lock) {
      setError(lock);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await login(email, password);
      if (!result.ok) {
        if (result.needsVerification) {
          router.push("/xac-thuc");
          return;
        }
        setError(result.error ?? "Đăng nhập thất bại.");
        return;
      }
      router.push("/cua-hang");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormShell
      title="Đăng nhập"
      subtitle="Tối đa 5 lần sai / 15 phút khóa. Tài khoản phải xác thực email trước khi mua hàng."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="text-gold hover:underline">
            Đăng ký ngay
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-base text-bone focus:border-gold outline-none min-h-[48px]"
          />
        </label>
        {error && <p className="text-sm text-crimson">{error}</p>}
        <Button type="submit" variant="primary" className="w-full min-h-[48px]" disabled={submitting}>
          {submitting ? "Đang xử lý…" : "Đăng nhập"}
        </Button>
        <Link
          href="/xac-thuc"
          className="block text-center text-xs text-bone/55 hover:text-gold py-2"
        >
          Chưa nhận mã xác thực?
        </Link>
      </form>
    </AuthFormShell>
  );
}
