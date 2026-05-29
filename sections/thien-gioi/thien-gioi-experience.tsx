"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, Sun, Bird, Star, Scale, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import RealmAudioToggle from "@/components/realm/realm-audio-toggle";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Divider from "@/components/ui/divider";
import { getRealmBySlug } from "@/data/realms";
import { getCreaturesByRealm } from "@/data/creatures";
import { getArtifactsByRealm } from "@/data/artifacts";
import { getLoreByRealm } from "@/data/lore";
import { getNarrativesForRealm } from "@/data/realm-narratives";
import RealmNarrativeSection from "@/sections/realm/realm-narrative-section";
import { useAmbientAudio } from "@/components/providers/audio-context";
import { getRealmAudio } from "@/data/realm-audio";

function CloudLayer({ speed = 1 }: { speed?: number }) {
  return (
    <motion.div
      animate={{ x: ["-5%", "5%", "-5%"] }}
      transition={{ duration: 20 / speed, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 opacity-30"
      style={{
        background:
          "radial-gradient(ellipse 40% 20% at 30% 20%, rgba(255,255,255,0.4), transparent), radial-gradient(ellipse 50% 25% at 70% 30%, rgba(198,169,114,0.15), transparent)",
        filter: "blur(24px)",
      }}
    />
  );
}

function CraneIcon() {
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      animate={{ y: [0, -12, 0], x: [0, 20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="text-gold/60"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M8 32 Q24 8 40 28 L36 30 Q24 14 12 32 Z"
      />
    </motion.svg>
  );
}

export default function ThienGioiExperience() {
  const realm = getRealmBySlug("thien-gioi")!;
  const audio = getRealmAudio("thien-gioi");
  const { fadeTo } = useAmbientAudio();
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 100]);
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const divineLight = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.5]);

  useEffect(() => {
    fadeTo(audio.src, audio.volume);
  }, [fadeTo, audio.src, audio.volume]);

  const creatures = getCreaturesByRealm("thien-gioi");
  const artifacts = getArtifactsByRealm("thien-gioi");
  const lore = getLoreByRealm("thien-gioi");

  const laws = [
    "Thiên Mệnh Chi Tự",
    "Biến Thiên Luật Nhân Quả",
    "Sổ Phong Thần Huyền Sử",
  ];

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-x-hidden bg-celestial text-shadow"
    >
      <Navbar />

      <RealmAudioToggle slug="thien-gioi" className="border-gold/30 bg-white/80 text-gold" />

      {/* Atmospheric sky */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EAF4FC] via-celestial to-celestial" />
        <motion.div style={{ y: cloudY }} className="absolute inset-0">
          <CloudLayer speed={0.8} />
          <CloudLayer speed={1.2} />
        </motion.div>
        <motion.div
          style={{ opacity: divineLight }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(198,169,114,0.25)_0%,transparent_55%)]"
        />
        <Image
          src={realm.image}
          alt=""
          fill
          className="object-cover opacity-[0.07] mix-blend-multiply"
          priority
          sizes="100vw"
        />
        <div className="absolute top-[15%] left-[20%]"><CraneIcon /></div>
        <div className="absolute top-[25%] right-[25%] opacity-60 scale-75"><CraneIcon /></div>
      </div>

      {/* HERO */}
      <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6">
        <Link
          href="/"
          className="absolute left-6 md:left-12 top-32 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gold hover:text-shadow transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Trở về nhân gian
        </Link>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="text-center">
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-gold tracking-[1em] uppercase text-[10px] mb-8 block"
          >
            {realm.eyebrow}
          </motion.span>
          <h1 className="font-heading text-7xl md:text-[10rem] text-gold leading-none mb-6 tracking-widest font-bold text-glow-gold">
            THIÊN GIỚI
          </h1>
          <Divider className="w-16 mx-auto mb-8" />
          <p className="max-w-2xl mx-auto text-xs md:text-sm tracking-[0.4em] uppercase text-shadow/60 leading-relaxed font-light">
            {realm.tagline}
          </p>
        </motion.div>
      </section>

      {/* CELESTIAL COURT */}
      <section className="relative z-10 py-40 px-6 max-w-7xl mx-auto">
        <SectionTitle eyebrow="Quyền năng vũ trụ" title="Thiên Đình" className="mb-20" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <Card className="lg:col-span-5 p-12 bg-white/50 border-gold/20" glow>
            <p className="text-sm leading-loose text-shadow/70 font-light tracking-wide">
              {lore[0]?.content ?? "Nơi ngự trị của những vị thần tối cao."}
            </p>
            <Divider className="my-8" />
            <div className="space-y-4">
              {laws.map((law) => (
                <div key={law} className="flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
                  <Scale size={14} className="opacity-60" /> {law}
                </div>
              ))}
            </div>
          </Card>
          <div className="lg:col-span-7 relative aspect-[16/10] border border-gold/10 overflow-hidden">
            <Image src={realm.image} alt="Thiên Đình" fill className="object-cover opacity-40" sizes="60vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-celestial via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* DIVINE CREATURES */}
      <section className="relative z-10 py-40 px-6 max-w-7xl mx-auto border-t border-gold/10">
        <SectionTitle eyebrow="Thần thú hộ giới" title="Linh Thú Thiên Giới" className="mb-20" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creatures.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-10 flex flex-col items-center text-center bg-white/40 border-gold/15" glow>
                <div className="mb-6 p-4 rounded-full border border-gold/20 text-gold bg-celestial">
                  {i === 0 ? <Bird size={22} /> : i === 1 ? <Star size={22} /> : <Sun size={22} />}
                </div>
                <h3 className="font-heading text-2xl text-gold mb-3 tracking-widest">{c.name}</h3>
                <p className="text-xs text-shadow/60 leading-loose font-light">{c.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ANCIENT LAWS */}
      <section className="relative z-10 py-40 px-6 max-w-5xl mx-auto">
        <SectionTitle eyebrow="Thiên đạo" title="Luật Thiên Giới" className="mb-16" />
        <div className="space-y-8">
          {laws.map((law, i) => (
            <motion.div
              key={law}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-6 border-l-2 border-gold/30 pl-8 py-4"
            >
              <span className="text-gold/40 font-mono text-sm">0{i + 1}</span>
              <span className="font-heading text-2xl text-gold tracking-widest">{law}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HEAVENLY ARCHIVE */}
      <section className="relative z-10 py-40 px-6 max-w-6xl mx-auto border-t border-gold/10 bg-white/30">
        <SectionTitle eyebrow="Cổ thư" title="Kho Thiên Thư" className="mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {artifacts.map((a) => (
            <Card key={a.id} className="p-8 flex gap-6 bg-white/50" glow>
              <BookOpen className="text-gold shrink-0" size={32} />
              <div>
                <h4 className="font-heading text-xl text-gold tracking-widest mb-2">{a.name}</h4>
                <p className="text-xs text-shadow/60 leading-relaxed">{a.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <RealmNarrativeSection eyebrow="Sử thư" blocks={getNarrativesForRealm("thien-gioi")} />

      <footer className="relative z-10 py-20 text-center border-t border-gold/10">
        <p className="text-[10px] uppercase tracking-[0.9em] text-gold/40">
          Chương I: Thiên Đạo Vĩnh Hằng
        </p>
      </footer>
    </main>
  );
}
