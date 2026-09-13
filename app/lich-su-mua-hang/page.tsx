"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { shopItems } from "@/data/shop";

interface ServerOrder {
  _id?: string;
  id?: string;
  items: { productId: string; name?: string; quantity: number; price: number }[];
  total: number;
  status?: string;
  createdAt: string;
}

/** Lịch sử mua hàng: đọc đơn thật từ server (/api/orders), có đăng nhập mới xem được. */
export default function PurchaseHistoryPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<ServerOrder[]>([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    setFetching(true);
    setError("");
    const token = localStorage.getItem("token");
    fetch("/api/orders", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
        setOrders(data.orders || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được lịch sử."))
      .finally(() => setFetching(false));
  }, [user, loading]);

  if (loading) return null;

  if (!user) {
    return (
      <PageAtmosphere variant="gold" className="text-bone pt-32 min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <h1 className="font-heading text-3xl text-gold mb-4">Lịch Sử Mua Hàng</h1>
          <p className="mb-6 text-bone/70">Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
          <Link href="/dang-nhap">
            <Button variant="primary">Đăng nhập</Button>
          </Link>
        </div>
      </PageAtmosphere>
    );
  }

  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-32">
        <h1 className="font-heading text-4xl text-gold mb-2">Lịch Sử Mua Hàng</h1>
        <p className="text-sm text-bone/60 mb-8">
          {fetching ? "Đang tải…" : `${orders.length} đơn hàng`}
          {" · "}
          <Link href="/cua-hang" className="text-gold hover:underline">Tiếp tục mua sắm</Link>
        </p>

        {error && (
          <p className="text-sm text-crimson bg-crimson/10 border border-crimson/20 p-3 rounded mb-4">{error}</p>
        )}

        {orders.length === 0 && !fetching && !error ? (
          <Card className="p-10 text-center" glow>
            <p className="text-bone/60 mb-4">Bạn chưa có đơn hàng nào.</p>
            <Link href="/cua-hang" className="text-gold underline">Mua sắm ngay</Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const id = order._id || order.id || "";
              return (
                <Card key={id} className="p-5" glow>
                  <div className="flex justify-between items-center text-sm text-bone/50 mb-3 border-b border-gold/10 pb-2">
                    <span>
                      Mã đơn: <strong className="text-gold">{id.slice(0, 12).toUpperCase()}</strong>
                    </span>
                    <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, i) => {
                      const product = shopItems.find((p) => p.id === item.productId);
                      return (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-bone/80">
                            {item.name || product?.name || item.productId}{" "}
                            <span className="text-bone/40">x{item.quantity}</span>
                          </span>
                          <span className="text-bone/90">
                            {(item.price * item.quantity).toLocaleString("vi-VN")} LT
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-right text-gold font-bold mt-3 pt-2 border-t border-gold/10">
                    Tổng: {order.total.toLocaleString("vi-VN")} LT
                    {order.status && order.status !== "paid" && (
                      <span className="ml-2 text-xs text-bone/50">({order.status})</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageAtmosphere>
  );
}