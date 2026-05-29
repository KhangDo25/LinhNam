"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { shopItems } from "@/data/shop";

export default function ThanhToanPage() {
  const router = useRouter();
  const params = useSearchParams();
  const totalParam = Number(params.get("total") ?? 0);
  const { user, cart, checkout, balance } = useAuth();
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const total = useMemo(() => {
    if (totalParam > 0) return totalParam;
    return cart.reduce((sum, line) => {
      const p = shopItems.find((i) => i.id === line.productId);
      return sum + (p?.priceValue ?? 0) * line.quantity;
    }, 0);
  }, [totalParam, cart]);

  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    setError("");
    try {
      const result = await checkout(total);
      if (!result.ok) {
        setError(result.error ?? "Thanh toán thất bại.");
        return;
      }
      if (result.orderId) {
        setOrderId(result.orderId);
        setDone(true);
      }
    } finally {
      setPaying(false);
    }
  };

  if (!user) {
    return (
      <PageAtmosphere variant="gold" className="text-bone pt-32 min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <p className="mb-6">Vui lòng đăng nhập trước khi thanh toán.</p>
          <Link href="/dang-nhap">
            <Button variant="primary">Đăng nhập</Button>
          </Link>
        </div>
      </PageAtmosphere>
    );
  }

  if (done) {
    return (
      <PageAtmosphere variant="gold" className="text-bone pt-32 min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <Card className="p-10" glow>
            <h1 className="font-heading text-3xl text-gold mb-4">Đặt hàng thành công</h1>
            <p className="text-sm text-bone/75 mb-2">Mã đơn: {orderId.slice(0, 8).toUpperCase()}</p>
            <p className="text-sm text-bone/60 mb-8">
              Đã trừ {total.toLocaleString("vi-VN")} Linh Thạch. Cảm ơn bạn đã mua tại Linh Nam.
            </p>
            <Link href="/cua-hang">
              <Button variant="primary">Tiếp tục mua sắm</Button>
            </Link>
          </Card>
        </div>
      </PageAtmosphere>
    );
  }

  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pb-32">
        <h1 className="font-heading text-4xl text-gold mb-8">Thanh Toán</h1>
        <Card className="p-8 space-y-4" glow>
          <div className="flex justify-between text-sm">
            <span className="text-bone/70">Người mua</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-bone/70">Tổng thanh toán</span>
            <span className="text-gold text-lg font-semibold">
              {total.toLocaleString("vi-VN")} LT
            </span>
          </div>
          <div className="flex justify-between text-sm border-t border-gold/10 pt-4">
            <span className="text-bone/70">Số dư hiện tại</span>
            <span>{balance.toLocaleString("vi-VN")} LT</span>
          </div>
          {error && <p className="text-sm text-crimson">{error}</p>}
          <Button variant="primary" className="w-full mt-4" onClick={handlePay} disabled={paying}>
            {paying ? "Đang xử lý…" : "Xác nhận thanh toán"}
          </Button>
          <Link href="/gio-hang" className="block text-center text-xs text-bone/50 hover:text-gold">
            ← Quay lại giỏ hàng
          </Link>
        </Card>
      </div>
    </PageAtmosphere>
  );
}
