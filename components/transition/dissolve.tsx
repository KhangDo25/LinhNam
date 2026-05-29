"use client";

import { motion } from "framer-motion";

interface DissolveProps {
  active?: boolean;
  variant?: "black" | "gold" | "void";
}

const variants = {
  black: "#050507",
  gold: "#C6A972",
  void: "#030303",
};

export default function Dissolve({
  active = false,
  variant = "black",
}: DissolveProps) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(0px)" }}
      animate={{ opacity: 1, filter: "blur(20px)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{ backgroundColor: variants[variant] }}
      aria-hidden
    />
  );
}
