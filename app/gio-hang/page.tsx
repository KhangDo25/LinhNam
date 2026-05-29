"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { shopItems } from "@/data/shop";

export default function GioHangPage() {
  const { cart, updateCartQty, removeFromCart, user, balance } = useAuth();

  const lines = cart
    .map((line) => {
      const product = shopItems.find((p) => p.id === line.productId);
      if (!product || product.priceValue === 0) return null;
      return { ...line, product, subtotal: product.priceValue * line.quantity };
    })
    .filter(Boolean) as {
    productId: string;
    quantity: number;
    product: (typeof shopItems)[number];
    subtotal: number;
  }[];

  const total = lines.reduce((s, l) => s + l.subtotal, 0);

  return (
    <PageAtmosphere variant="void" className="text-bone pt-32">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pb-32">
        <SectionTitle eyebrow="Cửa hàng" title="Giỏ Hàng" className="mb-10" />

        {!user && (
          <Card className="p-6 mb-8 border-gold/30 text-center" glow>
            <p className="text-sm text-bone/75 mb-4">Đăng nhập để thanh toán và lưu giỏ hàng.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/dang-nhap">
                <Button variant="primary" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/dang-ky">
                <Button variant="outline" size="sm">
                  Đăng ký
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {lines.length === 0 ? (
          <p className="text-center text-bone/60 py-16">
            Giỏ trống.{" "}
            <Link href="/cua-hang" className="text-gold underline">
              Mua sắm ngay
            </Link>
          </p>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {lines.map((line) => (
                <Card key={line.productId} className="p-4 flex gap-4 items-center" glow>
                  <div className="relative h-20 w-20 shrink-0 bg-mist border border-gold/10">
                    <Image
                      src={line.product.image}
                      alt={line.product.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-heading text-lg text-gold truncate">{line.product.name}</h3>
                    <p className="text-xs text-gold/70">
                      {line.product.priceValue.toLocaleString("vi-VN")} LT × {line.quantity}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => updateCartQty(line.productId, line.quantity - 1)}
                        className="p-1 border border-gold/30 text-gold hover:bg-gold/10"
                        aria-label="Giảm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-6 text-center">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(line.productId, line.quantity + 1)}
                        className="p-1 border border-gold/30 text-gold hover:bg-gold/10"
                        aria-label="Tăng"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.productId)}
                        className="ml-auto text-bone/50 hover:text-crimson"
                        aria-label="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gold font-semibold shrink-0">
                    {line.subtotal.toLocaleString("vi-VN")} LT
                  </p>
                </Card>
              ))}
            </div>

            <Card className="p-6 border-gold/25" glow>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-bone/70">Tạm tính</span>
                <span>{total.toLocaleString("vi-VN")} LT</span>
              </div>
              {user && (
                <div className="flex justify-between text-sm mb-6">
                  <span className="text-bone/70">Số dư</span>
                  <span className="text-gold">{balance.toLocaleString("vi-VN")} LT</span>
                </div>
              )}
              <Link href={user ? `/thanh-toan?total=${total}` : "/dang-nhap"}>
                <Button variant="primary" className="w-full" disabled={!user}>
                  {user ? "Thanh toán" : "Đăng nhập để thanh toán"}
                </Button>
              </Link>
            </Card>
          </>
        )}
      </div>
    </PageAtmosphere>
  );
}
