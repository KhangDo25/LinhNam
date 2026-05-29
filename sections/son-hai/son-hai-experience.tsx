"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, TreePine, Leaf, Mountain, Shield } from "lucide-react";
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

function ForestMist() {
  return (
    <motion.div
      animate={{ x: ["-10%", "10%", "-10%"], opacity: [0.2, 0.45, 0.2] }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 20% 80%, rgba(45,79,74,0.2), transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(45,79,74,0.12), transparent 45%)",
        filter: "blur(35px)",
      }}
    />
  );
}

function VineLayer() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-48 text-jade/20"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,200 Q360,80 720,140 T1440,100 L1440,200 Z"
      />
    </svg>
  );
}

export default function SonHaiExperience() {
  const realm = getRealmBySlug("son-hai")!;
  const audio = getRealmAudio("son-hai");
  const { fadeTo } = useAmbientAudio();
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, 90]);
  const forestDepth = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const lightFilter = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["brightness(0.9)", "brightness(1.05)", "brightness(0.85)"]
  );

  useEffect(() => {
    fadeTo(audio.src, audio.volume);
  }, [fadeTo, audio.src, audio.volume]);

  const creatures = getCreaturesByRealm("son-hai");
  const artifacts = getArtifactsByRealm("son-hai");
  const lore = getLoreByRealm("son-hai");
  const deities = getDeitiesByRealm("son-hai");

  const flora = [
    { name: "Linh Mộc Thần", desc: "Cây cổ ngàn năm, rễ xuyên tam giới." },
    { name: "Hoa Đăng Sơn", desc: "Nở một lần mỗi trăm năm, tỏa linh quang." },
    { name: "Trúc Tiên", desc: "Tre xanh không tàn, lá chứa tiên khí." },
  ];

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-x-hidden bg-[#0F1410] text-[#C8D4BC]"
    >
      <Navbar />
      <RealmAudioToggle slug="son-hai" className="border-jade/30 bg-[#0F1410]/80 text-jade" />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2E1A] via-[#0F1410] to-void" />
        <motion.div style={{ y: forestDepth }}>
          <ForestMist />
          <VineLayer />
        </motion.div>
        <motion.div style={{ filter: lightFilter }} className="absolute inset-0">
          <Image
            src={realm.image}
            alt=""
            fill
            className="object-cover opacity-[0.15] mix-blend-soft-light"
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(45,79,74,0.2)_0%,transparent_50%)]" />
      </div>

      <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6">
        <Link
          href="/"
          className="absolute left-6 md:left-12 top-32 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-jade hover:text-[#C8D4BC] transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Trở về nhân gian
        </Link>
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="text-center">
          <span className="text-jade tracking-[1em] uppercase text-[10px] mb-8 block">
            {realm.eyebrow}
          </span>
          <h1 className="font-heading text-7xl md:text-[10rem] text-jade leading-none mb-6 tracking-widest font-bold">
            SƠN HẢI
          </h1>
          <div className="w-16 h-px bg-jade/40 mx-auto mb-8" />
          <p className="max-w-2xl mx-auto text-xs md:text-sm tracking-[0.4em] uppercase text-[#C8D4BC]/50 leading-relaxed font-light">
            {realm.tagline}
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 py-40 px-6 max-w-7xl mx-auto">
        <SectionTitle eyebrow="Rừng cổ" title="Ancient Forest" subtitle={lore[0]?.excerpt} className="mb-20" />
        <p className="text-sm text-[#C8D4BC]/60 leading-loose font-light tracking-wide text-center max-w-3xl mx-auto mb-20">
          {lore[0]?.content}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {flora.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-10 text-center border-jade/20 bg-[#0F1410]/80" glow>
                <Leaf className="mx-auto mb-4 text-jade" size={28} />
                <h3 className="font-heading text-2xl text-jade mb-3 tracking-widest">{f.name}</h3>
                <p className="text-xs text-[#C8D4BC]/50 leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-40 px-6 max-w-6xl mx-auto border-t border-jade/10">
        <SectionTitle eyebrow="Thú thần" title="Forest Guardians" className="mb-16" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {creatures.map((c) => (
            <Card key={c.id} className="p-8 flex gap-6 border-jade/15" glow>
              <TreePine className="text-jade shrink-0" size={32} />
              <div>
                <Tag variant="jade" className="mb-3">{c.type}</Tag>
                <h3 className="font-heading text-xl text-jade tracking-widest mb-2">{c.name}</h3>
                <p className="text-xs text-[#C8D4BC]/50 leading-relaxed">{c.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-40 px-6 max-w-5xl mx-auto border-t border-jade/10">
        <SectionTitle eyebrow="Sơn thần" title="Mountain Deities" className="mb-12" />
        {deities
          .filter((d) => d.realm === "son-hai")
          .map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-6 mb-12 border-l-2 border-jade/30 pl-8"
            >
              <Mountain className="text-jade shrink-0 mt-1" size={22} />
              <div>
                <h4 className="font-heading text-2xl text-jade tracking-widest">{d.name}</h4>
                <p className="text-[10px] uppercase tracking-widest text-jade/50 mt-1">{d.title}</p>
                <p className="text-sm text-[#C8D4BC]/50 mt-3 leading-relaxed">{d.desc}</p>
              </div>
            </motion.div>
          ))}
      </section>

      <section className="relative z-10 py-40 px-6 max-w-6xl mx-auto border-t border-jade/10">
        <SectionTitle eyebrow="Bảo vật rừng" title="Forest Relics" className="mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {artifacts.map((a) => (
            <Card key={a.id} className="p-8 flex gap-4 bg-[#0F1410]/60 border-jade/15" glow>
              <Shield className="text-jade/60" size={24} />
              <div>
                <h4 className="font-heading text-xl text-jade mb-2">{a.name}</h4>
                <p className="text-xs text-[#C8D4BC]/50 leading-relaxed">{a.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <RealmNarrativeSection eyebrow="Sơn linh" blocks={getNarrativesForRealm("son-hai")} />

      <footer className="relative z-10 py-20 text-center border-t border-jade/10">
        <p className="text-[10px] uppercase tracking-[0.9em] text-jade/30">
          Chương II: Sơn Hải Vô Biên
        </p>
      </footer>
    </main>
  );
}
