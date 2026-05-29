"use client";

import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import CodexNav from "@/components/codex/codex-nav";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Tag from "@/components/ui/tag";
import MythCardImage from "@/components/myth/myth-card-image";
import { myths } from "@/data/myths";

export default function HuyenThoaiPage() {
  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <SectionTitle
          eyebrow="Bản Hùng Ca Ngàn Năm"
          title="Huyền Thoại"
          subtitle="Sử thi Việt Nam — nội dung tham chiếu Wikipedia & sử thư"
          className="mb-12"
        />
        <CodexNav />

        <div className="flex justify-center mb-12">
          <Link href="/su-thi">
            <Button variant="outline" size="sm">
              Mở Sử Thi đầy đủ
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {myths.map((m) => (
            <Link key={m.id} href={`/huyen-thoai/${m.id}`} className="group block h-full">
              <Card className="p-8 h-full overflow-hidden hover:border-gold/40 transition-colors" glow>
                <div className="relative -mx-8 -mt-8 mb-6 h-44 overflow-hidden">
                  <MythCardImage
                    myth={m}
                    className="opacity-60 group-hover:opacity-85 transition-opacity duration-500"
                  />
                </div>
                <Tag className="mb-3">{m.era}</Tag>
                <h3 className="font-heading text-2xl md:text-3xl text-gold mb-2 group-hover:text-celestial transition-colors">
                  {m.name}
                </h3>
                <p className="text-sm text-bone/80 mb-3">{m.excerpt}</p>
                <span className="text-[9px] uppercase tracking-[0.35em] text-gold/60">
                  Đọc truyện + nguồn Wikipedia →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageAtmosphere>
  );
}
