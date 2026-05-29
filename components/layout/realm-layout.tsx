"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import FogLayer from "@/components/visual/fog-layer";
import GlowOrb from "@/components/visual/glow-orb";
import Particles from "@/components/visual/particles";
import RealmImage from "@/components/visual/realm-image";
import { useHeroScroll, useParallaxScale, useParallaxY } from "@/animations/parallax";
import { useAmbientAudio } from "@/components/providers/audio-context";
import { RealmItem } from "@/data/realms";
import { cn } from "@/lib/cn";

interface RealmLayoutProps {
  realm: RealmItem;
  children: React.ReactNode;
}

export default function RealmLayout({ realm, children }: RealmLayoutProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scale, y, opacity, filter } = useHeroScroll(scrollYProgress);
  const bgScale = useParallaxScale(scrollYProgress);
  const bgY = useParallaxY(scrollYProgress);
  const { isPlaying, toggle, fadeTo } = useAmbientAudio();

  useEffect(() => {
    fadeTo(realm.audio, 0.35);
    return () => {};
  }, [realm.audio, fadeTo]);

  const t = realm.theme;

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: t.bg, color: t.text }}
    >
      <Navbar />

      <button
        onClick={() => toggle(realm.audio, 0.35)}
        className="fixed bottom-10 right-24 z-50 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-hover"
        style={{
          borderColor: `${t.accent}33`,
          backgroundColor: `${t.bg}cc`,
          color: t.accent,
        }}
        aria-label="Âm thanh cõi giới"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isPlaying ? "on" : "off"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {isPlaying ? (
              <Volume2 size={18} className="animate-pulse" />
            ) : (
              <VolumeX size={18} className="opacity-50" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={cn("absolute inset-0 bg-gradient-to-b opacity-95", t.gradient)} />
        <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0">
          <RealmImage
            src={realm.image}
            alt={realm.name}
            className="opacity-[0.08] mix-blend-multiply"
            priority
          />
        </motion.div>
        <FogLayer color={t.fogColor} />
        <GlowOrb color={`${t.accent}20`} position={{ top: "5%", left: "50%" }} />
        <Particles count={20} color="198, 169, 114" />
      </div>

      <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6">
        <Link
          href="/"
          className="absolute left-6 md:left-12 top-32 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] transition-colors duration-300 group cursor-hover"
          style={{ color: t.accent }}
          data-cursor-hover
        >
          <ChevronLeft
            size={14}
            className="transform group-hover:-translate-x-1 transition-transform"
          />
          Trở về nhân gian
        </Link>

        <motion.div
          style={{ scale, y, opacity, filter }}
          className="text-center will-change-transform"
        >
          <span
            className="tracking-[1em] uppercase text-[10px] mb-8 block font-medium"
            style={{ color: t.accent }}
          >
            {realm.eyebrow}
          </span>
          <h1
            className="font-[family-name:var(--font-cormorant)] text-7xl md:text-[10rem] leading-none mb-6 tracking-widest select-none font-bold"
            style={{ color: t.accent }}
          >
            {realm.name.toUpperCase()}
          </h1>
          <div
            className="w-16 h-[1px] mx-auto mb-8"
            style={{ backgroundColor: `${t.accent}66` }}
          />
          <p className="max-w-2xl mx-auto text-xs md:text-sm tracking-[0.4em] uppercase leading-relaxed font-light opacity-60">
            {realm.tagline}
          </p>
        </motion.div>

        <motion.div style={{ opacity }} className="absolute bottom-12 flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-[0.4em] uppercase opacity-40">
            Cuộn để khám phá
          </span>
          <div
            className="w-[1px] h-12 bg-gradient-to-b to-transparent"
            style={{ backgroundImage: `linear-gradient(to bottom, ${t.accent}80, transparent)` }}
          />
        </motion.div>
      </section>

      <div className="relative z-10">{children}</div>

      <footer
        className="relative z-10 py-24 text-center border-t"
        style={{ borderColor: `${t.accent}1a` }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.9em] font-medium opacity-40"
          style={{ color: t.accent }}
        >
          {realm.chapter} • Linh Nam Sử Thi
        </p>
      </footer>
    </main>
  );
}
