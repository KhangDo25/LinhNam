"use client";

import Lenis from "@studio-freight/lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { usePerformance } from "./performance-provider";
import { throttle } from "@/lib/performance";

export interface LenisScrollState {
  scroll: number;
  progress: number;
  velocity: number;
  direction: 1 | -1;
  isStopped: boolean;
}

const defaultState: LenisScrollState = {
  scroll: 0,
  progress: 0,
  velocity: 0,
  direction: 1,
  isStopped: true,
};

const LenisCtx = createContext<{
  lenis: Lenis | null;
  getState: () => LenisScrollState;
  scrollTo: (target: number | string | HTMLElement, options?: object) => void;
}>({
  lenis: null,
  getState: () => defaultState,
  scrollTo: () => {},
});

export function useLenis() {
  const ctx = useContext(LenisCtx);
  return {
    lenis: ctx.lenis,
    state: ctx.getState(),
    scrollTo: ctx.scrollTo,
  };
}

export function useLenisScroll(threshold = 30) {
  const { getState } = useContext(LenisCtx);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tick = () => {
      const s = getState();
      setScrolled((prev) => {
        const next = s.scroll > threshold;
        return prev === next ? prev : next;
      });
      setProgress((prev) =>
        Math.abs(prev - s.progress) < 0.01 ? prev : s.progress
      );
    };

    tick();
    const id = setInterval(tick, 150);
    return () => clearInterval(id);
  }, [getState, threshold]);

  return { scrolled, progress };
}

function updateStoryVars(progress: number) {
  const p = progress;
  document.documentElement.style.setProperty(
    "--story-fog",
    String(Math.min(p * 2.5, 1))
  );
  document.documentElement.style.setProperty(
    "--story-light",
    String(Math.min(Math.max((p - 0.05) * 2, 0), 1))
  );
  document.documentElement.style.setProperty(
    "--story-mountain",
    String(Math.min(Math.max((p - 0.12) * 2.2, 0), 1))
  );
  document.documentElement.style.setProperty(
    "--story-text",
    String(Math.min(Math.max((p - 0.18) * 2.5, 0), 1))
  );
  document.documentElement.style.setProperty(
    "--story-particles",
    String(Math.min(Math.max((p - 0.08) * 1.8, 0), 1))
  );
  document.documentElement.style.setProperty(
    "--story-realms",
    String(Math.min(Math.max((p - 0.45) * 2, 0), 1))
  );
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const perf = usePerformance();
  const lenisRef = useRef<Lenis | null>(null);
  const stateRef = useRef<LenisScrollState>(defaultState);

  const getState = useCallback(() => stateRef.current, []);

  useEffect(() => {
    const onNativeScroll = () => {
      const scroll = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const progress = Math.min(Math.max(scroll / max, 0), 1);
      stateRef.current = {
        scroll,
        progress,
        velocity: 0,
        direction: 1,
        isStopped: true,
      };
      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(progress)
      );
      document.documentElement.style.setProperty("--scroll-y", `${scroll}px`);
      updateStoryVars(progress);
    };

    if (!perf.smoothScroll) {
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      onNativeScroll();
      return () => window.removeEventListener("scroll", onNativeScroll);
    }

    const lenis = new Lenis({
      lerp: perf.profile === "full" ? 0.08 : 0.12,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis", "lenis-smooth");

    lenis.on(
      "scroll",
      (e: { scroll: number; velocity: number; direction: 1 | -1 }) => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight || 1;
        const progress = Math.min(Math.max(e.scroll / max, 0), 1);

        stateRef.current = {
          scroll: e.scroll,
          progress,
          velocity: e.velocity,
          direction: e.direction,
          isStopped: Math.abs(e.velocity) < 0.01,
        };

        document.documentElement.style.setProperty(
          "--scroll-progress",
          String(progress)
        );
        document.documentElement.style.setProperty(
          "--scroll-y",
          `${e.scroll}px`
        );
        document.documentElement.style.setProperty(
          "--scroll-velocity",
          String(Math.min(Math.abs(e.velocity), 1))
        );
        updateStoryVars(progress);
      }
    );

    let rafId: number;
    let visible = true;

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    function raf(time: number) {
      if (visible) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [perf.smoothScroll, perf.profile]);

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: object) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <LenisCtx.Provider value={{ lenis: lenisRef.current, getState, scrollTo }}>
      {children}
    </LenisCtx.Provider>
  );
}
