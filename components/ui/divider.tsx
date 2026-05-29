import { cn } from "@/lib/cn";

interface DividerProps {
  className?: string;
  variant?: "gold" | "fade" | "crimson";
}

export default function Divider({ className, variant = "gold" }: DividerProps) {
  const colors = {
    gold: "from-transparent via-[#C6A972]/40 to-transparent",
    fade: "from-transparent via-[#E8E0D0]/20 to-transparent",
    crimson: "from-transparent via-[#800000]/40 to-transparent",
  };

  return (
    <div
      className={cn(
        "h-[1px] w-full bg-gradient-to-r",
        colors[variant],
        className
      )}
    />
  );
}
