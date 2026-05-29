"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { usePerformance } from "@/components/providers/performance-provider";

const FogLayer = dynamic(() => import("@/components/visual/fog-layer"), {
  ssr: false,
});

interface PageAtmosphereProps {
  children: React.ReactNode;
  variant?: "void" | "gold" | "jade" | "ocean" | "blood";
  className?: string;
}

const variantStyles = {
  void: "from-background via-mist/30 to-void",
  gold: "from-background via-mist/40 to-void",
  jade: "from-background via-mist/30 to-void",
  ocean: "from-background via-mist/30 to-void",
  blood: "from-background via-mist/25 to-void",
};

export default function PageAtmosphere({
  children,
  variant = "void",
  className,
}: PageAtmosphereProps) {
  const perf = usePerformance();

  return (
    <div className={cn("relative min-h-screen overflow-x-hidden", className)}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b",
            perf.heavyBlur ? "opacity-90" : "opacity-95",
            variantStyles[variant]
          )}
        />
        {perf.fogAnimation && (
          <FogLayer intensity="light" color="rgba(198, 169, 114, 0.03)" />
        )}
        {perf.profile !== "minimal" && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_srgb,var(--gold)_5%,transparent),transparent_55%)]" />
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
