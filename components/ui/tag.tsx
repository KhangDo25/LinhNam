import { cn } from "@/lib/cn";

interface TagProps {
  children: React.ReactNode;
  variant?: "gold" | "void" | "crimson" | "jade" | "ocean" | "ember";
  className?: string;
}

const variantStyles = {
  gold: "border-gold/30 text-gold bg-gold/5",
  void: "border-bone/20 text-bone/60 bg-white/5",
  crimson: "border-blood/30 text-blood bg-blood/5",
  jade: "border-jade/30 text-jade bg-jade/5",
  ocean: "border-ocean/30 text-ocean bg-ocean/5",
  ember: "border-ember/30 text-ember bg-ember/5",
};

export default function Tag({
  children,
  variant = "gold",
  className,
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-block border px-3 py-1 text-[9px] uppercase tracking-[0.35em] font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
