export type PerformanceProfile = "full" | "balanced" | "minimal";

export interface PerformanceFlags {
  profile: PerformanceProfile;
  smoothScroll: boolean;
  customCursor: boolean;
  mouseLight: boolean;
  canvasParticles: boolean;
  fogAnimation: boolean;
  portalParticles: boolean;
  tiltCards: boolean;
  heavyBlur: boolean;
  pageTransitionBlur: boolean;
  loadingScreen: boolean;
}

function detectProfile(): PerformanceProfile {
  if (typeof window === "undefined") return "balanced";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return "minimal";

  const isMobile = window.innerWidth < 768;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowMemory =
    "deviceMemory" in navigator &&
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
  const lowCpu =
    "hardwareConcurrency" in navigator && navigator.hardwareConcurrency <= 4;

  if (isMobile || coarse) return "minimal";
  if (lowMemory || lowCpu) return "balanced";
  return "full";
}

export function getPerformanceFlags(): PerformanceFlags {
  const profile = detectProfile();

  return {
    profile,
    smoothScroll: profile === "full",
    customCursor: profile === "full",
    mouseLight: false,
    canvasParticles: profile === "full",
    fogAnimation: profile === "full",
    portalParticles: profile === "full",
    tiltCards: profile === "full",
    heavyBlur: profile === "full",
    pageTransitionBlur: profile === "full",
    loadingScreen: profile !== "minimal",
  };
}

export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  ms: number
): T {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = ms - (now - last);

    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  }) as T;
}
