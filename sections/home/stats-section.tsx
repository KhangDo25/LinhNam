"use client";

import { Mountain, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    icon: Mountain,
    title: "Lục Giới",
    desc: "Đa dạng cõi giới",
    href: "/#luc-gioi",
  },
  {
    icon: BookOpen,
    title: "Sử Thi",
    desc: "Kho tri thức đầy đủ",
    href: "/su-thi",
  },
  {
    icon: Sparkles,
    title: "Linh Vật",
    desc: "Vạn vật có linh",
    href: "/linh-thu",
  },
];

export default function StatsSection() {
  return (
    <section
      className="relative z-10 py-20 border-y border-gold/10 bg-background/50 backdrop-blur-sm overflow-hidden cv-auto"
      style={{ opacity: `calc(0.8 + var(--story-text) * 0.2)` }}
    >
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gold/10">
        {stats.map((stat, i) => (
          <Link
            key={stat.title}
            href={stat.href}
            className={`flex flex-col items-center gap-4 pt-6 md:pt-0 group cursor-hover ${i === 0 ? "first:pt-0" : "md:pl-4"}`}
            data-cursor-hover
          >
            <div className="p-3 rounded-full border border-gold/5 bg-black/20 transition-all duration-500 group-hover:border-gold/30 group-hover:shadow-[0_0_30px_rgba(198,169,114,0.1)]">
              <stat.icon className="text-gold opacity-70 group-hover:opacity-100 transition-opacity" size={28} />
            </div>
            <h3 className="font-heading text-3xl tracking-wide text-bone group-hover:text-gold transition-colors">
              {stat.title}
            </h3>
            <p className="text-[10px] tracking-[0.3em] text-bone/40 uppercase font-light">
              {stat.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
