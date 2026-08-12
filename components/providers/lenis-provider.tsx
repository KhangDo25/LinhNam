"use client";

import Lenis from "@studio-freight/lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { usePerformance } from "./performance-provider";

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

interface LenisContextValue {
  lenis: Lenis | null;
  getState: () => LenisScrollState;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: object
  ) => void;
}

const LenisCtx = createContext<LenisContextValue>({
  lenis: null,
  getState: () => defaultState,
  scrollTo: () => {},
});

/**
 * Small external store used to expose the Lenis instance
 * to React without calling setState() inside an effect.
 */
function createLenisStore() {
  let value: Lenis | null = null;
  const listeners = new Set<() => void>();

  return {
    getSnapshot: () => value,

    getServerSnapshot: () => null,

    subscribe(listener: () => void) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    setValue(next: Lenis | null) {
      value = next;

      listeners.forEach((listener) => {
        listener();
      });
    },
  };
}

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

  /**
   * The scroll state itself lives outside React.
   * We use a small polling subscription so React can re-render
   * when the external scroll state changes.
   */
  const subscribe = useCallback(
    (listener: () => void) => {
      const id = window.setInterval(listener, 150);

      return () => {
        window.clearInterval(id);
      };
    },
    []
  );

  const getSnapshot = useCallback(() => {
    const state = getState();

    return JSON.stringify({
      scrolled: state.scroll > threshold,
      progress: state.progress,
    });
  }, [getState, threshold]);

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () =>
      JSON.stringify({
        scrolled: false,
        progress: 0,
      })
  );

  return JSON.parse(snapshot) as {
    scrolled: boolean;
    progress: number;
  };
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

  /**
   * Important:
   * useMemo creates the store once for this component instance.
   * No ref is accessed during render.
   */
  const store = useMemo(() => createLenisStore(), []);

  const lenis = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const getState = useCallback(() => {
    return stateRef.current;
  }, []);

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

      document.documentElement.style.setProperty(
        "--scroll-y",
        `${scroll}px`
      );

      updateStoryVars(progress);
    };

    /**
     * Native scroll mode
     */
    if (!perf.smoothScroll) {
      lenisRef.current = null;
      store.setValue(null);

      window.addEventListener("scroll", onNativeScroll, {
        passive: true,
      });

      onNativeScroll();

      return () => {
        window.removeEventListener("scroll", onNativeScroll);
      };
    }

    /**
     * Lenis smooth scroll mode
     */
    const instance = new Lenis({
      lerp: perf.profile === "full" ? 0.08 : 0.12,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = instance;
    store.setValue(instance);

    document.documentElement.classList.add(
      "lenis",
      "lenis-smooth"
    );

    instance.on(
      "scroll",
      (e: {
        scroll: number;
        velocity: number;
        direction: 1 | -1;
      }) => {
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

    let rafId = 0;
    let visible = true;

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };

    document.addEventListener(
      "visibilitychange",
      onVisibility
    );

    const raf = (time: number) => {
      if (visible) {
        instance.raf(time);
      }

      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);

      document.removeEventListener(
        "visibilitychange",
        onVisibility
      );

      instance.destroy();

      lenisRef.current = null;
      store.setValue(null);

      document.documentElement.classList.remove(
        "lenis",
        "lenis-smooth"
      );
    };
  }, [perf.smoothScroll, perf.profile, store]);

  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: object
    ) => {
      const instance = lenisRef.current;

      if (instance) {
        instance.scrollTo(target, options);
        return;
      }

      if (typeof target === "number") {
        window.scrollTo({
          top: target,
          behavior: "smooth",
        });
      }
    },
    []
  );

  const contextValue = useMemo<LenisContextValue>(
    () => ({
      lenis,
      getState,
      scrollTo,
    }),
    [lenis, getState, scrollTo]
  );

  return (
    <LenisCtx.Provider value={contextValue}>
      {children}
    </LenisCtx.Provider>
  );
}