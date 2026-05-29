"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import Tag from "@/components/ui/tag";
import { LoreEntry } from "@/data/lore";
import { RealmItem } from "@/data/realms";

interface LoreSectionProps {
  realm: RealmItem;
  entries: LoreEntry[];
}

const categoryLabels = {
  mythology: "Thần Thoại",
  landscape: "Phong Cảnh",
  history: "Sử Thi",
  ritual: "Nghi Lễ",
};

export default function LoreSection({ realm, entries }: LoreSectionProps) {
  const accent = realm.theme.accent;

  return (
    <section className="py-48 px-6 max-w-6xl mx-auto">
      <SectionTitle
        eyebrow="Huyền sử"
        title="Truyền Thuyết Cõi Giới"
        className="mb-20"
      />

      <div className="space-y-20">
        {entries.map((entry) => (
          <motion.article
            key={entry.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {entry.image && (
              <div className="lg:col-span-5 relative aspect-[16/10] border overflow-hidden"
                style={{ borderColor: `${accent}1a` }}
              >
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  className="object-cover opacity-30 mix-blend-luminosity hover:opacity-50 transition-opacity duration-700"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            )}
            <div className={entry.image ? "lg:col-span-7" : "lg:col-span-12"}>
              <Tag className="mb-4">{categoryLabels[entry.category]}</Tag>
              <h3
                className="font-[family-name:var(--font-cormorant)] text-4xl mb-4 tracking-widest"
                style={{ color: accent }}
              >
                {entry.title}
              </h3>
              <p className="text-sm leading-loose opacity-50 font-light italic mb-4">
                {entry.excerpt}
              </p>
              <p className="text-sm leading-loose opacity-70 font-light tracking-wide">
                {entry.content}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
