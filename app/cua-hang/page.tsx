"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coins, ShoppingCart } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import { shopItems } from "@/data/shop";
import { useAuth } from "@/components/providers/auth-provider";
import PageIntroPanel from "@/components/content/page-intro-panel";
import { shopFacts } from "@/data/site-facts";

const rarityVariant = {
  common: "void" as const,
  rare: "gold" as const,
  legendary: "crimson" as const,
};

export default function CuaHangPage() {
  const router = useRouter();
  const { user, balance, addToCart, cartCount } = useAuth();

  const handleBuy = (productId: string, priceValue: number) => {
    if (!user) {
      router.push("/dang-nhap");
      return;
    }
    if (!user.emailVerified) {
      router.push("/xac-thuc");
      return;
    }
    if (priceValue === 0) return;
    addToCart(productId, 1);
  };

  return (
    <PageAtmosphere variant="void" className="text-gold pt-32">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-safe pb-28">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-gold/10 pb-8">
          <SectionTitle
            eyebrow="Tàng bảo Linh Nam"
            title="Cửa Hàng"
            subtitle="Mua bảo vật bằng Linh Thạch — giống trải nghiệm sàn thương mại"
          />
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 text-xs tracking-widest bg-gold/10 px-4 py-2 rounded-full text-gold">
              <Coins size={14} />
              {user
                ? `${balance.toLocaleString("vi-VN")} Linh Thạch`
                : "Đăng nhập để xem số dư"}
            </div>
            <Link
              href="/gio-hang"
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest border border-gold/30 px-4 py-2 text-bone hover:border-gold hover:text-gold"
            >
              <ShoppingCart size={14} />
              Giỏ ({cartCount})
            </Link>
          </div>
        </div>

        <PageIntroPanel
          title={shopFacts.title}
          body={shopFacts.body}
          citations={shopFacts.citations}
          tips={[
            `${shopItems.length} vật phẩm biểu tượng văn hóa.`,
            "Thanh toán bằng Linh Thạch ảo — không liên kết tiền thật.",
          ]}
        />

        {!user && (
          <Card className="p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-gold/25" glow>
            <p className="text-sm text-bone/80">
              Tạo tài khoản hoặc đăng nhập để thêm vào giỏ và thanh toán.
            </p>
            <div className="flex gap-3">
              <Link
                href="/dang-ky"
                className="px-5 py-2 bg-gold text-void text-[10px] uppercase tracking-widest font-bold"
              >
                Đăng ký
              </Link>
              <Link
                href="/dang-nhap"
                className="px-5 py-2 border border-gold/40 text-gold text-[10px] uppercase tracking-widest"
              >
                Đăng nhập
              </Link>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopItems.map((item) => (
            <Card key={item.id} className="p-6 group h-full flex flex-col border-gold/15" glow>
              <div className="relative aspect-square bg-mist/80 mb-5 overflow-hidden border border-gold/10">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-8 opacity-70 group-hover:opacity-95 transition-opacity"
                  sizes="300px"
                />
              </div>
              <Tag variant={rarityVariant[item.rarity]} className="mb-2 w-fit">
                {item.type}
              </Tag>
              <h3 className="text-xl font-heading text-bone group-hover:text-gold transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-bone/70 mt-2 flex-grow leading-relaxed">{item.desc}</p>
              <p className="text-sm text-gold font-semibold mt-4 mb-4">{item.price}</p>
              <button
                type="button"
                disabled={item.priceValue === 0}
                onClick={() => handleBuy(item.id, item.priceValue)}
                className="w-full py-3 bg-gold/10 hover:bg-gold hover:text-void transition-all text-[10px] uppercase tracking-widest font-bold disabled:opacity-30 disabled:pointer-events-none"
              >
                {item.priceValue === 0
                  ? "Huyền bí"
                  : user
                    ? "Thêm vào giỏ"
                    : "Đăng nhập để mua"}
              </button>
            </Card>
          ))}
        </div>
      </div>
    </PageAtmosphere>
  );
}
