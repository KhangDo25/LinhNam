"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { shopItems } from "@/data/shop";

export default function ThanhToanPage() {
  const params = useSearchParams();
  const totalParam = Number(params.get("total") ?? 0);

  const { user, cart, checkout, balance } = useAuth();

  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderedItems, setOrderedItems] = useState(cart);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const total = useMemo(() => {
    if (totalParam > 0) return totalParam;

    return cart.reduce((sum, line) => {
      const product = shopItems.find(
        (item) => item.id === line.productId
      );

      return sum + (product?.priceValue ?? 0) * line.quantity;
    }, 0);
  }, [totalParam, cart]);

  const handlePay = async () => {
    setPaying(true);
    setError("");

    const result = await checkout(total);

    if (!result.ok) {
      setError(result.error ?? "Thanh toán thất bại.");
      setPaying(false);
      return;
    }

    if (result.orderId) {
      setOrderId(result.orderId);
      setOrderedItems(result.items ?? cart);
      setDone(true);
    }

    setPaying(false);
  };

  if (!user) {
    return (
      <PageAtmosphere
        variant="gold"
        className="text-bone pt-32 min-h-screen"
      >
        <Navbar />

        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <p className="mb-6">
            Vui lòng đăng nhập trước khi thanh toán.
          </p>

          <Link href="/dang-nhap">
            <Button variant="primary">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </PageAtmosphere>
    );
  }

  if (done) {
    return (
      <PageAtmosphere
        variant="gold"
        className="text-bone pt-32 min-h-screen"
      >
        <Navbar />

        <div className="max-w-2xl mx-auto px-6 py-20">
          <Card className="p-8 md:p-10" glow>
            <div className="text-center mb-10">
              <div className="text-5xl mb-5">
                ✓
              </div>

              <h1 className="font-heading text-3xl md:text-4xl text-gold mb-3">
                Đặt hàng thành công
              </h1>

              <p className="text-sm text-bone/70">
                Shop Linh Nam đã nhận được đơn hàng của bạn.
              </p>

              <p className="text-xs text-bone/45 mt-3">
                Mã đơn:{" "}
                <span className="text-gold">
                  {orderId.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </div>

            <div className="border border-gold/10 rounded-lg overflow-hidden mb-8">
              <div className="px-5 py-4 bg-gold/5 border-b border-gold/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-gold">
                    Shop đã nhận
                  </span>

                  <span className="text-xs text-bone/50">
                    {orderedItems.length} sản phẩm
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gold/10">
                {orderedItems.map((item) => {
                  const product = shopItems.find(
                    (p) => p.id === item.productId
                  );

                  if (!product) return null;

                  const itemTotal =
                    product.priceValue * item.quantity;

                  return (
                    <div
                      key={item.productId}
                      className="px-5 py-4 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-bone">
                          {product.name}
                        </p>

                        <p className="text-xs text-bone/45 mt-1">
                          {item.quantity} ×{" "}
                          {product.priceValue.toLocaleString(
                            "vi-VN"
                          )}{" "}
                          LT
                        </p>
                      </div>

                      <span className="text-sm text-gold whitespace-nowrap">
                        {itemTotal.toLocaleString("vi-VN")} LT
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 border-t border-gold/10 pt-5 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-bone/60">
                  Trạng thái
                </span>

                <span className="text-green-400">
                  Đã thanh toán
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-bone/60">
                  Tổng cộng
                </span>

                <span className="text-lg text-gold font-semibold">
                  {total.toLocaleString("vi-VN")} LT
                </span>
              </div>
            </div>

            <p className="text-xs text-bone/45 text-center leading-relaxed mb-8">
              Đơn hàng đã được ghi nhận. Bạn có thể xem lại
              các đơn đã mua trong lịch sử đơn hàng.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/lich-su-don-hang"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  className="w-full"
                >
                  Xem đơn hàng
                </Button>
              </Link>

              <Link
                href="/cua-hang"
                className="flex-1"
              >
                <Button
                  variant="primary"
                  className="w-full"
                >
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </PageAtmosphere>
    );
  }

  return (
    <PageAtmosphere
      variant="gold"
      className="text-bone pt-32 min-h-screen"
    >
      <Navbar />

      <div className="max-w-md mx-auto px-6 pb-32">
        <h1 className="font-heading text-4xl text-gold mb-8">
          Thanh Toán
        </h1>

        <Card className="p-8 space-y-5" glow>
          <div className="flex justify-between text-sm">
            <span className="text-bone/70">
              Người mua
            </span>

            <span>
              {user.name}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-bone/70">
              Sản phẩm
            </span>

            <span>
              {cart.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-bone/70">
              Tổng thanh toán
            </span>

            <span className="text-gold text-lg font-semibold">
              {total.toLocaleString("vi-VN")} LT
            </span>
          </div>

          <div className="flex justify-between text-sm border-t border-gold/10 pt-4">
            <span className="text-bone/70">
              Số dư hiện tại
            </span>

            <span>
              {balance.toLocaleString("vi-VN")} LT
            </span>
          </div>

          {error && (
            <p className="text-sm text-crimson">
              {error}
            </p>
          )}

          <Button
            variant="primary"
            className="w-full mt-4"
            onClick={handlePay}
            disabled={paying}
          >
            {paying
              ? "Đang xử lý…"
              : "Xác nhận thanh toán"}
          </Button>

          <Link
            href="/gio-hang"
            className="block text-center text-xs text-bone/50 hover:text-gold"
          >
            ← Quay lại giỏ hàng
          </Link>
        </Card>
      </div>
    </PageAtmosphere>
  );
}