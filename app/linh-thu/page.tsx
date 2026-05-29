"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import CodexNav from "@/components/codex/codex-nav";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import Button from "@/components/ui/button";
import TiltCard from "@/components/interaction/tilt-card";
import { creatures } from "@/data/creatures";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/stagger";

export default function LinhThuPage() {
  return (
    <PageAtmosphere variant="jade" className="text-bone pt-32">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <SectionTitle
          eyebrow="Bách thú"
          title="Sách Linh Thú"
          subtitle="Toàn bộ linh vật trong Lục Giới"
          className="mb-12"
        />
        <CodexNav />
        <div className="flex justify-center mb-12">
          <Link href="/su-thi">
            <Button variant="outline" size="sm">
              Sử Thi → Linh Thú
            </Button>
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {creatures.map((creature) => (
            <motion.div key={creature.id} variants={staggerItem}>
              <TiltCard maxTilt={5}>
                <Card className="p-6 flex flex-col items-center text-center h-full" glow>
                  <div className="relative mb-4 h-24 w-24 rounded-full border border-gold/20 overflow-hidden">
                    <Image
                      src={creature.image}
                      alt={creature.name}
                      fill
                      className="object-contain p-4"
                      sizes="96px"
                    />
                  </div>
                  <Tag className="mb-3">{creature.type}</Tag>
                  <h3 className="font-heading text-xl text-gold mb-2 tracking-widest">
                    {creature.name}
                  </h3>
                  <p className="text-[10px] text-bone/40 uppercase tracking-widest mb-2">
                    {creature.realm.replace("-", " ")}
                  </p>
                  <p className="text-xs text-bone/50 leading-relaxed font-light">
                    {creature.desc}
                  </p>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageAtmosphere>
  );
}
