"use client";

import { cn } from "@/lib/cn";
import { cardHoverClass } from "@/animations/hover";

interface CardProps {
  className?: string;
  glow?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

export default function Card({
  className,
  glow,
  interactive = true,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-gold/15 bg-background/80 backdrop-blur-sm transition-transform duration-200",
        interactive && cardHoverClass,
        interactive && "hover:-translate-y-0.5",
        glow && "shadow-[0_0_40px_rgba(198,169,114,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}
