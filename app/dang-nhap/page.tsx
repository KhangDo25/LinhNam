"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/auth/auth-form-shell";
import Button from "@/components/ui/button";
import { useAuth, getPendingVerifyUserId } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (!result.ok) {
        if (result.needsVerification) {
          const pendingId = result.userId || getPendingVerifyUserId();
          if (pendingId) {
            localStorage.setItem("linh-nam-pending-verify", pendingId);
          }
          router.push("/xac-thuc");
          return;
        }
        setError(result.error || "Đăng nhập thất bại.");
        return;
      }

      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      title="Đăng nhập"
      subtitle="Chào mừng trở lại với LinhNam"
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="text-gold hover:underline">
            Đăng ký ngay
          </Link>
        </>
      }
    >
      {error && (
        <div className="bg-crimson/10 text-crimson p-3 rounded-md text-sm border border-crimson/20 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-bone/60">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-base text-bone focus:border-gold outline-none min-h-[48px]"
            placeholder="example@email.com"
          />
        </label>

        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-bone/60">Mật khẩu</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-base text-bone focus:border-gold outline-none min-h-[48px]"
            placeholder="••••••••"
          />
        </label>

        <Button
          type="submit"
          variant="primary"
          className="w-full min-h-[48px]"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </AuthFormShell>
  );
}