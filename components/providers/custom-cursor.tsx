"use client";

import { useEffect, useState } from "react";
import { usePerformance } from "./performance-provider";

export default function CustomCursor() {
  const perf = usePerformance();

  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !perf.customCursor) return;

    document.body.classList.add("custom-cursor-active");

    const handleOver = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const next = Boolean(
        target.closest(
          "a, button, [data-cursor-hover], .cursor-hover"
        )
      );

      setHovering((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("mouseover", handleOver, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mouseover", handleOver);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [mounted, perf.customCursor]);
  if (!mounted || !perf.customCursor) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[250]"
      style={{
        transform: "translate3d(var(--mouse-x), var(--mouse-y), 0)",
      }}
      aria-hidden="true"
    >
      <div
        className="
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border-2
          border-gold
          bg-gold/10
          transition-[width,height,opacity]
          duration-200
        "
        style={{
          width: hovering ? 40 : 8,
          height: hovering ? 40 : 8,
          opacity: hovering ? 0.6 : 1,
        }}
      />
    </div>
  );
}