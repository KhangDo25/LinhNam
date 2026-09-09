"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePerformance } from "@/components/providers/performance-provider";

export default function Template({ children }: { children: React.ReactNode }) {
  const perf = usePerformance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div>{children}</div>;
  }

  if (!perf.pageTransitionBlur) {
    return <div className="animate-fade-in">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}