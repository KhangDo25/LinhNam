"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, Ghost, Flame, Skull } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import RealmAudioToggle from "@/components/realm/realm-audio-toggle";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import { getRealmBySlug } from "@/data/realms";
import { getCreaturesByRealm } from "@/data/creatures";
import { getArtifactsByRealm } from "@/data/artifacts";
import { getLoreByRealm } from "@/data/lore";
import { getNarrativesForRealm } from "@/data/realm-narratives";
import RealmNarrativeSection from "@/sections/realm/realm-narrative-section";
import { useAmbientAudio } from "@/components/providers/audio-context";
import { getRealmAudio } from "@/data/realm-audio";
import { usePerformance } from "@/components/providers/performance-provider";

function EmberCanvas() {
  const perf = usePerformance();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!perf.canvasParticles) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    type E = { x: number; y: number; vy: number; s: number; a: number };
    const embers: E[] = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      vy: -(Math.random() * 1 + 0.3),
      s: Math.random() * 2 + 1,
      a: Math.random() * 0.6 + 0.2,
    }));

    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach((e) => {
        e.y += e.vy;
        e.x += Math.sin(e.y * 0.01) * 0.3;
        if (e.y < 0) {
          e.y = canvas.height + 20;
          e.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 92, 46, ${e.a})`;
        ctx.fill();
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
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none opacity-50"
      aria-hidden
    />
  );
}

function SmokeLayer() {
  const perf = usePerformance();
  if (!perf.fogAnimation) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 40% 60%, rgba(128,0,0,0.1), transparent 50%)",
        }}
      />
    );
  }
  return (
    <div
      className="absolute inset-0 animate-fog-drift-slow"
      style={{
        background:
          "radial-gradient(ellipse at 40% 60%, rgba(128,0,0,0.12), transparent 50%)",
      }}
    />
  );
}

export default function UMinhExperience() {
  const realm = getRealmBySlug("u-minh")!;
  const audio = getRealmAudio("u-minh");
  const { fadeTo } = useAmbientAudio();
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.2], [0, 8]);
  const heroFilter = useTransform(heroBlur, (v) => `blur(${v}px)`);
  const smokeOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.4, 0.7, 0.9]);

  useEffect(() => {
    fadeTo(audio.src, audio.volume);
  }, [fadeTo, audio.src, audio.volume]);

  const creatures = getCreaturesByRealm("u-minh");
  const artifacts = getArtifactsByRealm("u-minh");
  const lore = getLoreByRealm("u-minh");

  const spirits = [
    { name: "Hồn Đèn", type: "U Linh", desc: "Ánh sáng mờ dẫn đường, tan biến khi người sống lại gần." },
    { name: "Sương Ma", type: "Ảo Ảnh", desc: "Thực thể khói đen bao phủ, hút linh khí từ xương cốt." },
    { name: "Diệt Hồn", type: "Sát Thần", desc: "Chỉ xuất hiện khi long mạch đứt, mang theo tiếng thì thầm vĩnh hằng." },
  ];

  return (
    <main ref={pageRef} className="relative min-h-screen overflow-x-hidden bg-[#080808] text-bone">
      <Navbar />
      <EmberCanvas />

      <RealmAudioToggle slug="u-minh" className="border-blood/40 bg-void/80 text-bone" />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0A0A] via-[#080808] to-abyss" />
        <motion.div style={{ opacity: smokeOpacity }}>
          <SmokeLayer />
        </motion.div>
        <Image
          src={realm.image}
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-luminosity"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(128,0,0,0.15)_0%,transparent_50%)]" />
      </div>

      {/* HERO */}
      <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6">
        <Link
          href="/"
          className="absolute left-6 md:left-12 top-32 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-blood/70 hover:text-bone transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Trở về nhân gian
        </Link>

        <motion.div
          style={{ opacity: heroOpacity, filter: heroFilter }}
          className="text-center"
        >
          <motion.span
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="text-blood/60 tracking-[1em] uppercase text-[10px] mb-8 block font-lore"
          >
            {realm.eyebrow} — whisper
          </motion.span>
          <h1 className="font-heading text-7xl md:text-[10rem] text-bone/90 leading-none mb-6 tracking-widest font-bold drop-shadow-[0_0_60px_rgba(128,0,0,0.3)]">
            U MINH
          </h1>
          <div className="w-16 h-px bg-blood/40 mx-auto mb-8" />
          <p className="max-w-2xl mx-auto text-xs md:text-sm tracking-[0.4em] uppercase text-bone/40 leading-relaxed font-lore">
            {realm.tagline}
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-12 text-[9px] tracking-[0.5em] uppercase text-blood/30"
        >
          shadow • ember • silence
        </motion.div>
      </section>

      {/* SHADOW REALM */}
      <section className="relative z-10 py-40 px-6 max-w-5xl mx-auto">
        <SectionTitle
          eyebrow="Dị vực"
          title="Shadow Realm"
          subtitle={lore[0]?.excerpt}
          className="mb-16"
        />
        <p className="text-sm text-bone/50 leading-loose font-light tracking-wide text-center max-w-3xl mx-auto">
          {lore[0]?.content}
        </p>
      </section>

      {/* DARK SPIRITS */}
      <section className="relative z-10 py-40 px-6 max-w-4xl mx-auto border-t border-blood/10">
        <SectionTitle eyebrow="U linh" title="Dark Spirits" className="mb-16" />
        <div className="space-y-6">
          {spirits.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9 }}
              className="group border-l-2 border-blood/20 pl-8 py-6 hover:border-blood/60 transition-colors"
            >
              <h4 className="text-bone font-medium tracking-[0.3em] uppercase text-sm mb-2 flex items-center gap-3">
                <Ghost size={14} className="text-blood" />
                {s.name}
                <Tag variant="crimson">{s.type}</Tag>
              </h4>
              <p className="text-bone/40 text-xs leading-relaxed group-hover:text-bone/70 transition-colors font-lore">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CREATURES */}
      <section className="relative z-10 py-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creatures.map((c) => (
            <Card key={c.id} className="p-8 border-blood/15 bg-void/60" glow>
              <Skull className="text-blood/50 mb-4" size={24} />
              <h3 className="font-heading text-xl text-bone tracking-widest mb-2">{c.name}</h3>
              <p className="text-xs text-bone/70 leading-relaxed">{c.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* UNDERWORLD CODEX */}
      <section className="relative z-10 py-40 px-6 max-w-5xl mx-auto border-t border-blood/10">
        <SectionTitle eyebrow="Cổ thư u minh" title="Sử Thi U Minh" className="mb-12" />
        {artifacts.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-6 mb-12"
          >
            <Flame className="text-ember shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-heading text-2xl text-blood/80 tracking-widest mb-2">{a.name}</h4>
              <p className="text-sm text-bone/75 leading-loose font-lore">{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <RealmNarrativeSection eyebrow="U minh" blocks={getNarrativesForRealm("u-minh")} />

      <footer className="relative z-10 py-20 text-center border-t border-blood/10">
        <p className="text-[10px] uppercase tracking-[0.9em] text-bone/40 font-lore">
          Chương IV: U Minh Vĩnh Hằng
        </p>
      </footer>
    </main>
  );
}
