"use client";

import Link from "next/link";
import CodexNav from "@/components/codex/codex-nav";

export default function FooterSection() {
  return (
    <footer className="relative z-10 py-16 text-center border-t border-gold/10 bg-void">
      <Link href="/" className="cursor-hover" data-cursor-hover>
        <h2 className="font-heading text-2xl tracking-[0.3em] text-gold mb-6 hover:opacity-80 transition-opacity">
          LINH NAM
        </h2>
      </Link>
      <CodexNav />
      <p className="mt-8 text-[9px] uppercase tracking-[0.6em] text-bone/30">
        Phát triển bởi Khang Do • © 2026
      </p>
    </footer>
  );
}
