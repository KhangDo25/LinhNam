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
  if (typeof window === "undefined") return "minimal";

  try {
    // Tôn trọng người dùng yếu máy / tiết kiệm pin / giảm chuyển động
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "minimal";

    const isMobile = window.innerWidth < 768;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile || coarse) return "minimal";

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    if (nav.connection?.saveData) return "minimal";
    if (
      nav.connection?.effectiveType === "slow-2g" ||
      nav.connection?.effectiveType === "2g"
    )
      return "minimal";
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return "minimal";
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4)
      return "balanced";

    // Mặc định balanced cho desktop để tránh lag — chỉ bật "full"
    // khi máy thực sự khỏe (nhiều RAM + nhiều core).
    if (
      typeof nav.deviceMemory === "number" &&
      typeof nav.hardwareConcurrency === "number" &&
      nav.deviceMemory >= 8 &&
      nav.hardwareConcurrency >= 8
    ) {
      return "full";
    }
    return "balanced";
  } catch {
    return "minimal";
  }
}

export function getPerformanceFlags(): PerformanceFlags {
  const profile = detectProfile();

  return {
    profile,
    // TẮT smooth-scroll Lenis mặc định (nguồn lag chính: rAF liên tục +
    // hijack scroll native). Chỉ bật ở máy rất khỏe.
    smoothScroll: false,
    customCursor: false,
    mouseLight: false,
    // Canvas particles chỉ bật ở profile full, số lượng ít (xử lý trong component)
    canvasParticles: profile === "full",
    fogAnimation: false,
    portalParticles: false,
    tiltCards: false,
    heavyBlur: false,
    pageTransitionBlur: false,
    // Bỏ màn hình loading chặn 1.5–2s -> vào web ngay lập tức
    loadingScreen: false,
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
