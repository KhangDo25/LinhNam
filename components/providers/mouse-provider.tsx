"use client";

import { useEffect } from "react";

/** Chỉ ghi CSS variables — không setState → không re-render cây React */
export default function MouseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const isTouch = "ontouchstart" in window;
    const isMobile = window.innerWidth < 768;
    if (isTouch || isMobile) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
      document.documentElement.style.setProperty("--mouse-nx", String(nx));
      document.documentElement.style.setProperty("--mouse-ny", String(ny));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <>{children}</>;
}
