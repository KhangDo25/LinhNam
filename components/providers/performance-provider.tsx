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

const SERVER_DEFAULT_FLAGS: PerformanceFlags = {
  profile: "balanced",
  smoothScroll: false,
  customCursor: false,
  mouseLight: false,
  canvasParticles: false,
  fogAnimation: false,
  portalParticles: false,
  tiltCards: false,
  heavyBlur: false,
  pageTransitionBlur: false,
  loadingScreen: false,
};

export default function PerformanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [flags, setFlags] = useState(SERVER_DEFAULT_FLAGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onResize = () => setFlags(getPerformanceFlags());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const value = useMemo(() => flags, [flags]);

  useEffect(() => {
    setFlags(getPerformanceFlags());
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.dataset.perf = flags.profile;
    }
  }, [flags.profile, mounted]);

  return (
    <PerfCtx.Provider value={value}>
      {children}
    </PerfCtx.Provider>
  );
}

