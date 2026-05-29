"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/auth/auth-form-shell";
import Button from "@/components/ui/button";
import { useAuth, getPendingVerifyUserId } from "@/components/providers/auth-provider";

export default function XacThucPage() {
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUserId(getPendingVerifyUserId());
    const stored = sessionStorage.getItem("linh-nam-demo-otp");
    if (stored) {
      setDemoCode(stored);
      sessionStorage.removeItem("linh-nam-demo-otp");
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("Không có phiên đăng ký. Vui lòng đăng ký lại.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await verifyEmail(userId, code);
      if (!result.ok) {
        setError(result.error ?? "Xác thực thất bại.");
        return;
      }
      router.push("/cua-hang");
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!userId) return;
    const result = await resendVerification(userId);
    if (result.ok && result.demoCode) {
      setDemoCode(result.demoCode);
      setError("");
    } else {
      setError(result.error ?? "Không gửi được mã.");
    }
  };

  return (
    <AuthFormShell
      title="Xác thực email"
      subtitle="Nhập mã 6 số (dev: mã hiển thị sau đăng ký; production cần gửi email thật)."
      footer={
        <Link href="/dang-nhap" className="text-gold hover:underline">
          Quay lại đăng nhập
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-bone/60">
            Mã xác thực
          </span>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-center text-lg tracking-[0.5em] text-bone focus:border-gold outline-none min-h-[48px]"
            placeholder="000000"
          />
        </label>
        {demoCode && (
          <p className="text-xs text-gold/90 bg-gold/10 border border-gold/25 p-3 text-center">
            Mã demo (lưu trên MongoDB): <strong>{demoCode}</strong>
          </p>
        )}
        {error && <p className="text-sm text-crimson">{error}</p>}
        <Button type="submit" variant="primary" className="w-full min-h-[48px]" disabled={submitting}>
          {submitting ? "Đang xử lý…" : "Xác nhận"}
        </Button>
        <button
          type="button"
          onClick={onResend}
          className="w-full text-xs text-bone/60 hover:text-gold py-2 min-h-[44px]"
        >
          Gửi lại mã
        </button>
      </form>
    </AuthFormShell>
  );
}
