"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import MythCardImage from "@/components/myth/myth-card-image";
import { myths } from "@/data/myths";
import { creatures } from "@/data/creatures";
import { artifacts } from "@/data/artifacts";
import { loreEntries } from "@/data/lore";
import PageIntroPanel from "@/components/content/page-intro-panel";
import { suThiFacts } from "@/data/site-facts";

const tabs = [
  { id: "myths", label: "Truyện" },
  { id: "bestiary", label: "Linh Thú" },
  { id: "artifacts", label: "Di Vật" },
  { id: "archive", label: "Cổ Thư" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SuThiPage() {
  const [tab, setTab] = useState<TabId>("myths");

  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <SectionTitle
          eyebrow="Kho tri thức Linh Nam"
          title="Sử Thi"
          subtitle="Truyện cổ — Linh thú — Di vật — Nguồn Wikipedia & sử thư"
          className="mb-8"
        />

        <PageIntroPanel
          title={suThiFacts.title}
          body={suThiFacts.body}
          citations={suThiFacts.citations}
          tips={[
            `${myths.length} truyện có trang chi tiết và liên kết Wikipedia.`,
            "Ảnh từ Wikimedia Commons — có thể khác minh họa trong sách in.",
          ]}
        />

        <nav className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.35em] border transition-all cursor-hover ${
                tab === t.id
                  ? "border-gold text-gold bg-gold/10"
                  : "border-gold/25 text-bone/70 hover:border-gold/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "myths" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {myths.map((m) => (
              <Link key={m.id} href={`/huyen-thoai/${m.id}`} className="group block">
                <Card className="p-8 h-full hover:border-gold/40 overflow-hidden" glow>
                  <div className="relative -mx-8 -mt-8 mb-6 h-44 overflow-hidden">
                    <MythCardImage myth={m} className="opacity-60 group-hover:opacity-85 transition-opacity" />
                  </div>
                  <Tag className="mb-3">{m.era}</Tag>
                  <h3 className="font-heading text-2xl text-gold mb-2">{m.name}</h3>
                  <p className="text-sm text-bone/75 mb-3">{m.excerpt}</p>
                  <span className="text-[9px] text-gold/60 uppercase tracking-widest">
                    Đọc truyện — nguồn Wikipedia →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {tab === "bestiary" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatures.map((c) => (
              <Card key={c.id} className="p-6 text-center" glow>
                <div className="relative mx-auto mb-4 h-20 w-20">
                  <Image src={c.image} alt={c.name} fill className="object-contain p-3" sizes="80px" />
                </div>
                <h3 className="font-heading text-lg text-gold">{c.name}</h3>
                <p className="text-xs text-bone/70 mt-2">{c.desc}</p>
              </Card>
            ))}
          </div>
        )}

        {tab === "artifacts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {artifacts.map((a) => (
              <Card key={a.id} className="p-8 flex gap-6" glow>
                <div className="relative h-20 w-20 shrink-0">
                  <Image src={a.image} alt={a.name} fill className="object-contain" sizes="80px" />
                </div>
                <div>
                  <h3 className="font-heading text-xl text-gold">{a.name}</h3>
                  <p className="text-xs text-bone/75 mt-2 leading-relaxed">{a.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "archive" && (
          <div className="space-y-8">
            {loreEntries.map((e) => (
              <Card key={e.id} className="p-10" glow>
                <h3 className="font-heading text-3xl text-gold mb-3">{e.title}</h3>
                <p className="text-sm text-bone/80 leading-loose">{e.content}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageAtmosphere>
  );
}
