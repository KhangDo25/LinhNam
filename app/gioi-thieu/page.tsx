"use client";

import { History, ShieldCheck, Heart, Sparkles, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Divider from "@/components/ui/divider";
import PageIntroPanel from "@/components/content/page-intro-panel";
import { gioiThieuFacts } from "@/data/site-facts";
import Link from "next/link";

const values = [
  {
    icon: History,
    title: "Sứ Mệnh",
    desc: "Tái hiện huyền thoại và truyện cổ Việt Nam qua trải nghiệm số, ưu tiên nguồn công khai có thể kiểm chứng.",
  },
  {
    icon: ShieldCheck,
    title: "Kiểm Chứng Nguồn",
    desc: "Mỗi truyện gắn liên kết Wikipedia tiếng Việt hoặc cơ quan chính thống (UNESCO, Bảo tàng, sử thư).",
  },
  {
    icon: BookOpen,
    title: "Sử Thi & Huyền Thoại",
    desc: "14+ truyện: Lạc Long Quân, Tấm Cám, Sọ Dừa, Bánh chưng… với trang chi tiết và trích dẫn.",
  },
  {
    icon: Heart,
    title: "Trải Nghiệm Mượt",
    desc: "Tối ưu cho điện thoại: tắt hiệu ứng nặng, hỗ trợ sáng/tối, cuộn native trên máy yếu.",
  },
  {
    icon: Sparkles,
    title: "Linh Hồn Linh Nam",
    desc: "Ngôn ngữ và biểu tượng Việt — Lục Giới, linh thú, cửa hàng bảo vật (demo).",
  },
];

const routes = [
  { href: "/su-thi", label: "Sử Thi — kho truyện" },
  { href: "/huyen-thoai", label: "Huyền Thoại — danh mục" },
  { href: "/linh-thu", label: "Sách Linh Thú" },
  { href: "/cua-hang", label: "Cửa Hàng (demo)" },
];

export default function GioiThieuPage() {
  return (
    <PageAtmosphere variant="gold" className="text-bone pt-28 md:pt-32">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-safe pb-24">
        <SectionTitle
          eyebrow="Về dự án"
          title="Giới Thiệu"
          subtitle="Digital Vietnamese Mythology Experience"
          className="mb-10"
        />

        <PageIntroPanel
          title={gioiThieuFacts.title}
          body={gioiThieuFacts.body}
          citations={gioiThieuFacts.citations}
        />

        <Card className="p-6 md:p-10 mb-12 text-center border-gold/15" glow>
          <p className="font-lore text-sm leading-[2] text-bone/75">
            &ldquo;Chúng tôi tôn vinh kho tàng truyện cổ Việt Nam.&rdquo;
          </p>
        </Card>

        <div className="space-y-10 mb-12">
          {values.map((v) => (
            <div key={v.title} className="flex gap-5 md:gap-8">
              <v.icon className="text-gold shrink-0 mt-1" size={26} />
              <div>
                <h2 className="text-gold text-xs tracking-widest uppercase mb-2 font-bold">
                  {v.title}
                </h2>
                <p className="text-sm leading-relaxed text-bone/75">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Card className="p-6 md:p-8 mb-12" glow>
          <h3 className="font-heading text-xl text-gold mb-4">Khám phá nhanh</h3>
          <ul className="space-y-3">
            {routes.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-sm text-bone/80 hover:text-gold transition-colors">
                  → {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Divider className="my-12" />

        <p className="text-center text-[10px] uppercase tracking-[0.5em] text-gold/40">
          Phát triển bởi Khang Do • 2026
        </p>
      </div>
    </PageAtmosphere>
  );
}
