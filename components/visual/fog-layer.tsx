"use client";

import { cn } from "@/lib/cn";
import { usePerformance } from "@/components/providers/performance-provider";

interface FogLayerProps {
  intensity?: "light" | "medium" | "heavy";
  color?: string;
  className?: string;
}

export default function FogLayer({
  intensity = "medium",
  color = "rgba(198, 169, 114, 0.04)",
  className,
}: FogLayerProps) {
  const perf = usePerformance();
  const opacity = { light: 0.3, medium: 0.5, heavy: 0.8 }[intensity];

  if (!perf.fogAnimation) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          className
        )}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            opacity,
            background: `radial-gradient(ellipse at 30% 50%, ${color} 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, ${color} 0%, transparent 45%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute -inset-[15%] h-[130%] w-[130%] animate-fog-drift-slow"
        style={{
          opacity,
          background: `radial-gradient(ellipse at 30% 50%, ${color} 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${color} 0%, transparent 40%)`,
        }}
      />
    </div>
  );
}
