"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import RealmImage from "@/components/visual/realm-image";
import TiltCard from "@/components/interaction/tilt-card";
import { RealmItem } from "@/data/realms";
import { useNavTransition } from "@/components/providers/nav-transition";
import { usePerformance } from "@/components/providers/performance-provider";
import { cn } from "@/lib/cn";

const PortalParticles = dynamic(
  () => import("@/components/visual/portal-particles"),
  { ssr: false }
);

interface RealmPortalCardProps {
  realm: RealmItem;
  index: number;
  reverse?: boolean;
}

export default function RealmPortalCard({
  realm,
  index,
  reverse,
}: RealmPortalCardProps) {
  const perf = usePerformance();
  const { navigate } = useNavTransition();
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent) => {
    if (perf.profile !== "full") return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <article
      className={cn(
        "grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16 items-center",
        reverse && "md:[direction:rtl] md:[&>*]:[direction:ltr]"
      )}
    >
      {/* Ảnh cõi giới — chiếm 3/5 */}
      <div className="md:col-span-3 w-full min-h-[280px] md:min-h-[360px]">
        <TiltCard maxTilt={perf.tiltCards ? 5 : 0} className="h-full min-h-[inherit]">
          <button
            ref={cardRef}
            type="button"
            onClick={() => navigate(`/${realm.slug}`, realm.theme.transition)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={onMove}
            className={cn(
              "group relative block w-full h-full min-h-[280px] md:min-h-[360px] text-left cursor-hover overflow-hidden rounded-sm border border-gold/25 bg-mist/80",
              hovered && "border-gold/50 shadow-[0_0_40px_rgba(198,169,114,0.15)]"
            )}
            data-cursor-hover
          >
            {hovered && perf.portalParticles && (
              <PortalParticles accent={realm.theme.accent} />
            )}

            <div
              className="absolute inset-0 z-[1] pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, color-mix(in srgb, ${realm.theme.accent} 28%, transparent), transparent 60%)`,
              }}
            />

            <div className="absolute inset-0 z-0">
              <RealmImage
                src={realm.image}
                alt={realm.name}
                className="opacity-65 transition-all duration-700 group-hover:opacity-90 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority={index === 0}
              />
            </div>

            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-void/65 via-void/15 to-transparent" />

            <span className="absolute bottom-4 left-4 z-[4] text-[10px] uppercase tracking-[0.4em] text-bone/90 border border-gold/30 px-4 py-2 bg-void/50 opacity-0 group-hover:opacity-100 transition-opacity">
              Mở cổng →
            </span>
          </button>
        </TiltCard>
      </div>

      {/* Chữ — căn giữa theo chiều dọc, KHÔNG đẩy xuống góc */}
      <div
        className={cn(
          "md:col-span-2 flex flex-col justify-center gap-5 px-2 md:px-4",
          reverse && "md:items-end"
        )}
      >
        <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-bold">
          {realm.chapter}
        </span>
        <h3
          className={cn(
            "font-heading text-4xl md:text-5xl tracking-widest text-bone leading-tight",
            reverse && "md:text-right"
          )}
        >
          {realm.name}
        </h3>
        <p
          className={cn(
            "text-sm text-bone/75 font-light leading-relaxed tracking-wide",
            reverse && "md:text-right"
          )}
        >
          {realm.desc}. Khám phá vùng đất huyền bí chứa đựng sử thi và linh vật cổ xưa.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/${realm.slug}`, realm.theme.transition)}
          className={cn(
            "flex items-center gap-4 text-[10px] text-gold uppercase tracking-[0.3em] font-bold group/btn cursor-hover w-fit",
            reverse && "md:ml-auto"
          )}
          data-cursor-hover
        >
          <span>Tiến vào cõi giới</span>
          <div className="h-px w-8 bg-gold transition-all duration-500 group-hover/btn:w-16" />
        </button>
      </div>
    </article>
  );
}
