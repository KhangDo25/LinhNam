"use client";

import { motion } from "framer-motion";

interface FadeWorldProps {
  active?: boolean;
}

export default function FadeWorld({ active = false }: FadeWorldProps) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="pointer-events-none fixed inset-0 z-[200] bg-[#050507]"
      aria-hidden
    />
  );
}
