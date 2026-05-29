"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import Divider from "@/components/ui/divider";
import { Artifact } from "@/data/artifacts";
import { RealmItem } from "@/data/realms";
import { fadeInBlur } from "@/animations/fade";

interface ArtifactsSectionProps {
  realm: RealmItem;
  artifacts: Artifact[];
}

export default function ArtifactsSection({
  realm,
  artifacts,
}: ArtifactsSectionProps) {
  const accent = realm.theme.accent;

  return (
    <section
      className="py-48 px-6 border-t"
      style={{ borderColor: `${accent}1a` }}
    >
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          eyebrow="Bảo vật cổ xưa"
          title="Di Vật Thần Thoại"
          className="mb-20"
        />
        <Divider className="mb-16" />

        <div className="space-y-16">
          {artifacts.map((artifact, idx) => (
            <motion.div
              key={artifact.id}
              variants={fadeInBlur}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div
                className="relative w-full md:w-2/5 aspect-square border overflow-hidden"
                style={{ borderColor: `${accent}26` }}
              >
                <Image
                  src={artifact.image}
                  alt={artifact.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="w-full md:w-3/5 space-y-4">
                <span
                  className="text-[10px] tracking-[0.4em] uppercase font-bold"
                  style={{ color: accent }}
                >
                  {artifact.era}
                </span>
                <h3
                  className="font-[family-name:var(--font-cormorant)] text-3xl tracking-widest"
                  style={{ color: accent }}
                >
                  {artifact.name}
                </h3>
                <p className="text-sm leading-loose opacity-60 font-light tracking-wide">
                  {artifact.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
