"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformance } from "@/components/providers/performance-provider";
import MountainSilhouette from "@/components/visual/mountain-silhouette";

export default function HeroDepthLayers() {
  const perf = usePerformance();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const runningRef = useRef(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !perf.canvasParticles) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const count = perf.profile === "full" ? 22 : 12;
    let rafId = 0;
    let lastFrame = 0;
    const frameInterval = perf.profile === "full" ? 32 : 48;

    type P = { x: number; y: number; s: number; sp: number; a: number };
    const particles: P[] = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      s: Math.random() * 1.5 + 0.5,
      sp: Math.random() * 0.15 + 0.05,
      a: Math.random() * 0.35 + 0.1,
    }));

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w && h) {
        canvas.width = w;
        canvas.height = h;
        particles.forEach((p) => {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
        });
      }
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const onVisibility = () => {
      runningRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    let storyP = 0;
    let mx = 0;

    const draw = (time: number) => {
      rafId = requestAnimationFrame(draw);
      if (!runningRef.current) return;
      if (time - lastFrame < frameInterval) return;
      lastFrame = time;

      storyP = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--story-particles"
        ) || "0"
      );
      mx = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--mouse-nx"
        ) || "0"
      );

      if (storyP < 0.05 && time % 1200 < frameInterval) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const density = 0.25 + storyP * 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.sp * (0.4 + storyP * 0.4);
        p.x += mx * 0.15;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.globalAlpha = p.a * density;
        ctx.fillStyle = "#C6A972";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mounted, perf.canvasParticles, perf.profile]);

  if (!mounted) {
    return <div className="fixed inset-0 z-0 bg-abyss pointer-events-none" />;
  }

  const fogBlur = perf.heavyBlur ? "blur(40px)" : "none";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none contain-strict">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, color-mix(in srgb, var(--gold) calc(8% + var(--story-light) * 12%), transparent), transparent 70%), linear-gradient(180deg, var(--abyss) 0%, var(--void) 100%)",
          opacity: "calc(0.85 + var(--story-light) * 0.15)",
          transform: "translate3d(0, calc(var(--scroll-y) * -0.01), 0)",
        }}
      />

      <div
        className="absolute -inset-[20%]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, color-mix(in srgb, var(--bone) calc(var(--story-fog) * 6%), transparent), transparent 55%), radial-gradient(ellipse at 70% 40%, color-mix(in srgb, var(--gold) calc(var(--story-fog) * 4%), transparent), transparent 50%)",
          transform: "translate3d(0, calc(var(--scroll-y) * -0.04), 0)",
          filter: fogBlur,
          opacity: "calc(0.3 + var(--story-fog) * 0.5)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          transform:
            "translate3d(0, calc(var(--scroll-y) * -0.08 + (1 - var(--story-mountain)) * 80px), 0)",
          opacity: "calc(0.4 + var(--story-mountain) * 0.6)",
        }}
      >
        <MountainSilhouette />
      </div>

      {perf.canvasParticles && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: "calc(0.3 + var(--story-particles) * 0.5)",
            transform: "translate3d(0, calc(var(--scroll-y) * -0.05), 0)",
          }}
          aria-hidden
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, var(--void) 0%, transparent 40%), linear-gradient(to bottom, var(--abyss) 0%, transparent 25%)",
          transform: "translate3d(0, calc(var(--scroll-y) * -0.12), 0)",
          opacity: "calc(0.6 + var(--story-fog) * 0.4)",
        }}
      />

      {perf.mouseLight && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(480px circle at var(--mouse-x) var(--mouse-y), color-mix(in srgb, var(--gold) calc(5% + var(--story-light) * 8%), transparent), transparent 65%)",
            opacity: "calc(0.4 + var(--story-light) * 0.4)",
            transform: "translate3d(0, calc(var(--scroll-y) * -0.02), 0)",
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, var(--abyss) 100%)",
        }}
      />
    </div>
  );
}
