"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

const PRESET_AMOUNTS = [50_000, 100_000, 200_000, 500_000, 1_000_000];

export default function NapTienPage() {
  const { user, balance, topup } = useAuth();
  const [amount, setAmount] = useState<number>(100_000);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleTopup = async () => {
    setError("");
    setMessage("");
    const value = customAmount ? Number(customAmount) : amount;
    if (!value || value < 10000) {
      setError("Số tiền nạp tối thiểu là 10.000 Linh Thạch.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await topup(value);
      if (!result.ok) {
        setError(result.error || "Nạp tiền thất bại.");
        return;
      }
      setMessage(result.message || "Nạp tiền thành công!");
      setCustomAmount("");
    } catch (err) {
      console.warn("Topup error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pb-32">
        <h1 className="font-heading text-4xl text-gold mb-2">Nạp Tiền</h1>
        <p className="text-sm text-bone/60 mb-8">
          Số dư hiện tại:{" "}
          <span className="text-gold font-semibold">
            {balance.toLocaleString("vi-VN")} LT
          </span>
          {!user && " (vui lòng đăng nhập để nạp tiền)"}
        </p>
        <Card className="p-8 space-y-5" glow>
          <div className="grid grid-cols-2 gap-3">
            {PRESET_AMOUNTS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setAmount(v);
                  setCustomAmount("");
                }}
                className={`border px-4 py-3 text-sm min-h-[48px] transition ${
                  amount === v && !customAmount
                    ? "border-gold text-gold bg-gold/10"
                    : "border-gold/20 text-bone/70 hover:border-gold/50"
                }`}
              >
                {v.toLocaleString("vi-VN")} LT
              </button>
            ))}
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-bone/60">
              Hoặc nhập số tiền khác
            </span>
            <input
              type="number"
              min={10000}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Ví dụ: 150000"
              className="mt-2 w-full border border-gold/20 bg-mist/50 px-4 py-3 text-bone focus:border-gold outline-none min-h-[48px]"
            />
          </label>
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
            variant="primary"
            className="w-full"
            onClick={handleTopup}
            disabled={submitting || !user}
          >
            {submitting ? "Đang xử lý..." : "Xác nhận nạp tiền"}
          </Button>
          <p className="text-xs text-bone/40 text-center">
            Nạp tối thiểu 10.000 Linh Thạch. Tiền được cộng ngay vào tài khoản.
          </p>
        </Card>
      </div>
    </PageAtmosphere>
  );
}
