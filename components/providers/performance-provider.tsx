"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  getPerformanceFlags,
  type PerformanceFlags,
} from "@/lib/performance";

const PerfCtx = createContext<PerformanceFlags | null>(null);

export function usePerformance() {
  const ctx = useContext(PerfCtx);
  if (!ctx) {
    return getPerformanceFlags();
  }
  return ctx;
}

export default function PerformanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [flags, setFlags] = useState(getPerformanceFlags);

  useEffect(() => {
    const onResize = () => setFlags(getPerformanceFlags());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const value = useMemo(() => flags, [flags]);

  useEffect(() => {
    document.documentElement.dataset.perf = flags.profile;
  }, [flags.profile]);

  return <PerfCtx.Provider value={value}>{children}</PerfCtx.Provider>;
}
