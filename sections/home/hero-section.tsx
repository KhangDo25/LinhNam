"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import Button from "@/components/ui/button";

export default function HeroSection() {
  const scrollToRealms = () => {
    document.getElementById("luc-gioi")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 sm:px-6 pt-20">
      {/* Ảnh nền mở đầu — collage cõi giới */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/realms/thien-gioi.png"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.38] mix-blend-soft-light"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/25 via-void/50 to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(198,169,114,0.12)_0%,transparent_55%)]" />
      </div>

      <div
        className="relative z-10 flex flex-col items-center text-center max-w-4xl"
        style={{
          opacity: "calc(1 - var(--scroll-progress) * 2)",
          transform: "translate3d(0, calc(var(--scroll-progress) * -60px), 0)",
        }}
      >
        <span className="mb-6 text-[9px] uppercase tracking-[0.6em] text-gold/80 md:text-[10px]">
          Trải nghiệm thần thoại Việt Nam
        </span>

        <h1 className="select-none font-heading text-4xl sm:text-6xl tracking-[0.15em] sm:tracking-[0.25em] text-gold md:text-[9rem] md:tracking-[0.35em]">
          LINH NAM
        </h1>

        <p
          className="mt-8 max-w-2xl text-center text-sm md:text-base text-bone/80 leading-relaxed font-light"
          style={{ opacity: "calc(0.6 + var(--story-text) * 0.4)" }}
        >
          Khi huyền sử vẫn còn thức giấc — Lục Giới, linh thú, và sử thi ngàn năm
        </p>

        <div className="mt-10 h-px w-[120px] bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="mt-12">
          <Button
            variant="primary"
            size="lg"
            onClick={scrollToRealms}
            className="cursor-hover"
          >
            Khám phá Lục Giới
          </Button>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ opacity: "calc(1 - var(--scroll-progress) * 3)" }}
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-bone/60">
          Cuộn xuống
        </span>
        <div className="text-gold/60 animate-bounce-slow">
          <ArrowDown size={16} />
        </div>
      </div>
    </section>
  );
}
