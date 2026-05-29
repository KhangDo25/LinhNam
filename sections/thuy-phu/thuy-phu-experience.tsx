"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, Waves, Droplets, Gem, Anchor } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import RealmAudioToggle from "@/components/realm/realm-audio-toggle";
import { getRealmBySlug } from "@/data/realms";
import { getCreaturesByRealm } from "@/data/creatures";
import { getArtifactsByRealm } from "@/data/artifacts";
import { getLoreByRealm } from "@/data/lore";
import { getNarrativesForRealm } from "@/data/realm-narratives";
import RealmNarrativeSection from "@/sections/realm/realm-narrative-section";
import { getDeitiesByRealm } from "@/data/deities";
import { useAmbientAudio } from "@/components/providers/audio-context";
import { getRealmAudio } from "@/data/realm-audio";
import { usePerformance } from "@/components/providers/performance-provider";
import { cn } from "@/lib/cn";

function WaveLayer() {
  const perf = usePerformance();
  return (
    <div
      className={cn(
        "absolute bottom-0 left-[-10%] right-[-10%] h-[40vh]",
        perf.fogAnimation && "animate-fog-drift-slow"
      )}
      style={{
        background: "linear-gradient(to top, rgba(74,122,155,0.2), transparent)",
        clipPath: "ellipse(80% 100% at 50% 100%)",
      }}
    />
  );
}

function BubbleCanvas() {
  const perf = usePerformance();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!perf.canvasParticles) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    type B = { x: number; y: number; vy: number; r: number };
    const bubbles: B[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      vy: -(Math.random() * 0.8 + 0.2),
      r: Math.random() * 4 + 2,
    }));

    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((b) => {
        b.y += b.vy;
        if (b.y < -20) {
          b.y = canvas.height + 20;
          b.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(74, 122, 155, 0.25)";
        ctx.fillStyle = "rgba(74, 122, 155, 0.08)";
        ctx.fill();
        ctx.stroke();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
    };
  }, [perf.canvasParticles]);

  if (!perf.canvasParticles) return null;

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-[1] pointer-events-none opacity-40"
      aria-hidden
    />
  );
}

export default function ThuyPhuExperience() {
  const realm = getRealmBySlug("thuy-phu")!;
  const audio = getRealmAudio("thuy-phu");
  const { fadeTo } = useAmbientAudio();
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 80]);
  const depthY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const caustics = useTransform(scrollYProgress, [0, 0.6, 1], [0.2, 0.6, 0.4]);

  useEffect(() => {
    fadeTo(audio.src, audio.volume);
  }, [fadeTo, audio.src, audio.volume]);

  const creatures = getCreaturesByRealm("thuy-phu");
  const artifacts = getArtifactsByRealm("thuy-phu");
  const lore = getLoreByRealm("thuy-phu");
  const deities = getDeitiesByRealm("thuy-phu");

  const tides = [
    { name: "Triều Linh", desc: "Dòng nước mang linh khí từ Long Cung lên mặt biển." },
    { name: "Hải Nhãn", desc: "Vực sâu nhìn thấu tam giới, nơi Thủy Long ngự trị." },
    { name: "Mạch Ngầm", desc: "Dòng chảy ẩn kết nối nhân gian và thủy phủ." },
  ];

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-x-hidden bg-[#060D14] text-[#A8C4D4]"
    >
      <Navbar />
      <BubbleCanvas />
      <RealmAudioToggle slug="thuy-phu" className="border-ocean/30 bg-[#060D14]/80 text-ocean" />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1A2E] via-[#060D14] to-abyss" />
        <motion.div style={{ y: depthY }} className="absolute inset-0">
          <WaveLayer />
        </motion.div>
        <motion.div style={{ opacity: caustics }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(120deg, transparent, transparent 80px, rgba(74,122,155,0.03) 80px, rgba(74,122,155,0.03) 160px)",
            }}
          />
        </motion.div>
        <Image
          src={realm.image}
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-soft-light"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(74,122,155,0.2)_0%,transparent_55%)]" />
      </div>

      <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6">
        <Link
          href="/"
          className="absolute left-6 md:left-12 top-32 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-ocean hover:text-[#A8C4D4] transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Trở về nhân gian
        </Link>
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="text-center">
          <span className="text-ocean tracking-[1em] uppercase text-[10px] mb-8 block">
            {realm.eyebrow}
          </span>
          <h1 className="font-heading text-7xl md:text-[10rem] text-ocean leading-none mb-6 tracking-widest font-bold drop-shadow-[0_0_40px_rgba(74,122,155,0.3)]">
            THỦY PHỦ
          </h1>
          <div className="w-16 h-px bg-ocean/40 mx-auto mb-8" />
          <p className="max-w-2xl mx-auto text-xs md:text-sm tracking-[0.4em] uppercase text-[#A8C4D4]/50 leading-relaxed font-light">
            {realm.tagline}
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 py-40 px-6 max-w-7xl mx-auto">
        <SectionTitle eyebrow="Long cung" title="Dragon Palace" subtitle={lore[0]?.excerpt} className="mb-16" />
        <div className="relative aspect-[21/9] border border-ocean/20 overflow-hidden mb-20">
          <Image src={realm.image} alt="Long Cung" fill className="object-cover opacity-50" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D14] via-transparent to-[#060D14]/50" />
          <p className="absolute bottom-8 left-8 right-8 text-sm text-[#A8C4D4]/70 leading-loose max-w-2xl">
            {lore[0]?.content}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tides.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <Card className="p-8 text-center border-ocean/20 bg-[#060D14]/70" glow>
                <Waves className="mx-auto mb-4 text-ocean" size={26} />
                <h3 className="font-heading text-xl text-ocean mb-2 tracking-widest">{t.name}</h3>
                <p className="text-xs text-[#A8C4D4]/50 leading-relaxed">{t.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-40 px-6 max-w-6xl mx-auto border-t border-ocean/10">
        <SectionTitle eyebrow="Hải thần" title="Sea Creatures" className="mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {creatures.map((c) => (
            <Card key={c.id} className="p-8 border-ocean/15 flex gap-6" glow>
              <Droplets className="text-ocean shrink-0" size={28} />
              <div>
                <Tag variant="ocean" className="mb-2">{c.type}</Tag>
                <h3 className="font-heading text-2xl text-ocean tracking-widest mb-2">{c.name}</h3>
                <p className="text-xs text-[#A8C4D4]/50 leading-relaxed">{c.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-40 px-6 max-w-5xl mx-auto border-t border-ocean/10">
        <SectionTitle eyebrow="Thủy thần" title="Ocean Deities" className="mb-12" />
        {deities
          .filter((d) => d.realm === "thuy-phu")
          .map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10 pl-8 border-l border-ocean/30"
            >
              <h4 className="font-heading text-2xl text-ocean">{d.name}</h4>
              <p className="text-[10px] uppercase tracking-widest text-ocean/50 mt-1">{d.title}</p>
              <p className="text-sm text-[#A8C4D4]/50 mt-3 leading-relaxed">{d.desc}</p>
            </motion.div>
          ))}
      </section>

      <section className="relative z-10 py-40 px-6 max-w-6xl mx-auto border-t border-ocean/10">
        <SectionTitle eyebrow="Châu báu đáy biển" title="Deep Treasures" className="mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {artifacts.map((a) => (
            <Card key={a.id} className="p-8 flex gap-4 border-ocean/15" glow>
              <Gem className="text-ocean/70 shrink-0" size={22} />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-ocean/40">{a.era}</span>
                <h4 className="font-heading text-lg text-ocean mt-1 mb-2">{a.name}</h4>
                <p className="text-xs text-[#A8C4D4]/50 leading-relaxed">{a.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <RealmNarrativeSection eyebrow="Thủy thần" blocks={getNarrativesForRealm("thuy-phu")} />

      <footer className="relative z-10 py-20 text-center border-t border-ocean/10">
        <p className="text-[10px] uppercase tracking-[0.9em] text-ocean/30 flex items-center justify-center gap-2">
          <Anchor size={12} /> Chương III: Thủy Phủ Thâm Uyên
        </p>
      </footer>
    </main>
  );
}
