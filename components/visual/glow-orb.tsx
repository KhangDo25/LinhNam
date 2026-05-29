"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface GlowOrbProps {
  color?: string;
  size?: number;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  pulse?: boolean;
  className?: string;
}

export default function GlowOrb({
  color = "rgba(198, 169, 114, 0.15)",
  size = 400,
  position = { top: "10%", left: "50%" },
  pulse = true,
  className,
}: GlowOrbProps) {
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] } : undefined}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className={cn("pointer-events-none absolute -translate-x-1/2 rounded-full blur-3xl", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        ...position,
      }}
      aria-hidden
    />
  );
}
