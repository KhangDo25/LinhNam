"use client";

import { useEffect } from "react";

/** Chỉ ghi CSS variables — không setState → không re-render cây React.
 *  Throttle bằng rAF để mousemove nhanh không spam style recalc. */
export default function MouseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const isTouch = "ontouchstart" in window;
    const isMobile = window.innerWidth < 768;
    if (isTouch || isMobile) return;

    let raf = 0;
    let pending: MouseEvent | null = null;

    const flush = () => {
      raf = 0;
      if (!pending) return;
      const e = pending;
      pending = null;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      const root = document.documentElement;
      root.style.setProperty("--mouse-x", `${e.clientX | 0}px`);
      root.style.setProperty("--mouse-y", `${e.clientY | 0}px`);
      root.style.setProperty("--mouse-nx", nx.toFixed(3));
      root.style.setProperty("--mouse-ny", ny.toFixed(3));
    };

    const onMove = (e: MouseEvent) => {
      pending = e;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <>{children}</>;
}
