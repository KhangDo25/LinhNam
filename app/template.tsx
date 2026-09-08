"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePerformance } from "@/components/providers/performance-provider";

function AppTemplate({ children }: { children: React.ReactNode }) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      // ... existing animation props ...
    >
      {children}
    </motion.div>
  );
}