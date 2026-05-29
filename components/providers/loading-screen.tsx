"use client";

import { useEffect, useState } from "react";
import { usePerformance } from "./performance-provider";

export default function LoadingScreen() {
  const perf = usePerformance();
  const [loading, setLoading] = useState(perf.loadingScreen);

  useEffect(() => {
    if (!perf.loadingScreen) {
      document.documentElement.classList.add("lenis");
      return;
    }

    const t2 = setTimeout(() => {
      setLoading(false);
      document.documentElement.classList.add("lenis");
    }, perf.profile === "balanced" ? 1500 : 2000);

    return () => clearTimeout(t2);
  }, [perf.loadingScreen, perf.profile]);

  if (!perf.loadingScreen || !loading) return null;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background transition-opacity duration-500">
      <h1 className="font-heading text-3xl md:text-5xl text-gold tracking-[0.25em] animate-fade-in">
        LINH NAM
      </h1>
      <p className="mt-4 text-[9px] uppercase tracking-[0.5em] text-bone/50">
        Đang mở cổng…
      </p>
    </div>
  );
}
