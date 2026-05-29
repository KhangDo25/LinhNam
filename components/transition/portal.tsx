"use client";

import { motion } from "framer-motion";

interface PortalTransitionProps {
  active?: boolean;
  color?: string;
}

export default function PortalTransition({
  active = false,
  color = "#C6A972",
}: PortalTransitionProps) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 3, opacity: 1 }}
      exit={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
      aria-hidden
    >
      <div
        className="h-32 w-32 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          boxShadow: `0 0 100px ${color}60`,
        }}
      />
      <div className="absolute inset-0 bg-[#050507]/90" />
    </motion.div>
  );
}
