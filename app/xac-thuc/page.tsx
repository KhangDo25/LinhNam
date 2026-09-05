"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/auth/auth-form-shell";
import Button from "@/components/ui/button";
import {
  useAuth,
  getPendingVerifyUserId,
} from "@/components/providers/auth-provider";

export default function XacThucPage() {
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  useEffect(() => {
    const pendingUserId = getPendingVerifyUserId();
    if (pendingUserId) {
      setUserId(pendingUserId);
      setEmailSent(true); 
    } else {
      router.push("/dang-ky");
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      setError("Không có phiên đăng ký. Vui lòng đăng ký lại.");
      return;
    }

    if (code.length !== 6) {
      setError("Vui lòng nhập đủ 6 số.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const result = await verifyEmail(userId, code);

      if (!result.ok) {
        setError(result.error ?? "Xác thực thất bại.");
        return;
      }

      setMessage("✅ Xác thực thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push("/dang-nhap?verified=true");
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!userId) {
      setError("Không có phiên đăng ký. Vui lòng đăng ký lại.");
      return;
    }

    setResending(true);
    setError("");
    setMessage("");

    try {
      const result = await resendVerification(userId);
      
      if (!result.ok) {
        setError(result.error ?? "Không thể gửi lại mã.");
        return;
      }

      setMessage("✅ Đã gửi lại mã xác thực! Vui lòng kiểm tra email.");
      setEmailSent(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthFormShell
      title="Xác thực email"
      subtitle="Nhập mã 6 số đã được gửi đến email của bạn."
      footer={
        <Link
          href="/dang-nhap"
          className="text-gold hover:underline"
        >
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
            onChange={(e) =>
              setCode(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-center text-lg tracking-[0.5em] text-bone focus:border-gold outline-none min-h-[48px]"
            placeholder="000000"
          />
        </label>
        <div className="text-xs text-bone/40 bg-mist/20 p-3 rounded border border-gold/10">
          <p className="flex items-center gap-2">
            <span>📧</span>
            <span>Mã xác thực đã được gửi đến email của bạn.</span>
          </p>
          <p className="mt-1 text-bone/30">
            Kiểm tra cả hộp thư <strong>Spam</strong> nếu không thấy email.
          </p>
          {emailSent && (
            <p className="mt-1 text-emerald-400/60 text-[10px]">
              ✅ Email đã được gửi. Vui lòng kiểm tra hộp thư.
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-crimson bg-crimson/10 p-2 rounded border border-crimson/20">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm text-emerald-400 bg-emerald-400/10 p-2 rounded border border-emerald-400/20">
            {message}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full min-h-[48px]"
          disabled={submitting}
        >
          {submitting ? "Đang xác thực..." : "Xác nhận"}
        </Button>

        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="w-full text-xs text-bone/60 hover:text-gold py-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {resending ? "Đang gửi..." : "Gửi lại mã"}
        </button>

        <div className="text-center text-xs text-bone/30">
          <p>Mã có hiệu lực trong <strong className="text-gold/60">15 phút</strong>.</p>
        </div>
      </form>
    </AuthFormShell>
  );
}