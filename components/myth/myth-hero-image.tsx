"use client";

import Image from "next/image";
import { useState } from "react";
import type { MythStory } from "@/data/myths";

interface MythHeroImageProps {
  myth: MythStory;
  priority?: boolean;
}

export default function MythHeroImage({ myth, priority }: MythHeroImageProps) {
  const [src, setSrc] = useState(myth.imageUrl || myth.image);
  const isRemote = src.startsWith("http");

  return (
    <div className="relative h-56 md:h-80 mb-10 overflow-hidden border border-gold/15">
      <Image
        src={src}
        alt={myth.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 768px"
        priority={priority}
        unoptimized={isRemote}
        onError={() => setSrc(myth.image)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/25 to-transparent" />
    </div>
  );
}
