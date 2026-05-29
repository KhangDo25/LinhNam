"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

interface RealmImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

export default function RealmImage({
  src,
  alt,
  fill = true,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, 60vw",
  width,
  height,
}: RealmImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
