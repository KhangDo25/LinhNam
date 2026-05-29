"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import { staggerContainer, staggerItem } from "@/animations/stagger";
import { Creature } from "@/data/creatures";
import { RealmItem } from "@/data/realms";

interface CreaturesSectionProps {
  realm: RealmItem;
  creatures: Creature[];
}

export default function CreaturesSection({
  realm,
  creatures,
}: CreaturesSectionProps) {
  const accent = realm.theme.accent;

  return (
    <section className="py-48 px-6 max-w-7xl mx-auto">
      <SectionTitle
        eyebrow="Linh thú hộ giới"
        title="Thần Thú & Linh Vật"
        subtitle="Những sinh linh mang hơi thở cổ xưa trong truyền thuyết Linh Nam"
        className="mb-24"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {creatures.map((creature) => (
          <motion.div key={creature.id} variants={staggerItem}>
            <Card
              className="p-8 flex flex-col items-center text-center cursor-hover"
              glow
            >
              <div
                className="relative mb-6 h-24 w-24 overflow-hidden rounded-full border opacity-80"
                style={{ borderColor: `${accent}33` }}
              >
                <Image
                  src={creature.image}
                  alt={creature.name}
                  fill
                  className="object-cover p-4"
                  sizes="96px"
                />
              </div>
              <Tag className="mb-4">{creature.type}</Tag>
              <h3
                className="font-heading text-2xl mb-3 tracking-widest"
                style={{ color: accent }}
              >
                {creature.name}
              </h3>
              <p className="text-xs leading-loose opacity-60 font-light tracking-wide max-w-[240px]">
                {creature.desc}
              </p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
