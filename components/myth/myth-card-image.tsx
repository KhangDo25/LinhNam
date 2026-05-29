"use client";

import Image from "next/image";
import { useState } from "react";
import type { MythStory } from "@/data/myths";

interface MythCardImageProps {
  myth: MythStory;
  className?: string;
}

export default function MythCardImage({ myth, className = "" }: MythCardImageProps) {
  const [src, setSrc] = useState(myth.imageUrl || myth.image);
  const isRemote = src.startsWith("http");

  return (
    <Image
      src={src}
      alt={myth.name}
      fill
      className={`object-cover ${className}`}
      sizes="50vw"
      unoptimized={isRemote}
      onError={() => setSrc(myth.image)}
    />
  );
}
