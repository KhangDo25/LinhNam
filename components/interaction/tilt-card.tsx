"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { usePerformance } from "@/components/providers/performance-provider";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export default function TiltCard({
  children,
  className,
  maxTilt = 8,
}: TiltCardProps) {
  const perf = usePerformance();
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("none");

  if (!perf.tiltCards) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(1000px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`
    );
  };

  const onLeave = () => setTransform("none");

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform, transition: "transform 0.12s ease-out" }}
      className={cn("gpu", className)}
    >
      {children}
    </div>
  );
}
