import { cn } from "@/lib/cn";
import { typography } from "@/styles/typography";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            typography.sizes.caption,
            "text-gold font-semibold"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          typography.heading.className,
          typography.sizes.h2,
          "text-bone tracking-wide"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "h-px bg-gold/30",
          align === "center" ? "w-24" : "w-16"
        )}
      />
      {subtitle && (
        <p className="max-w-xl text-sm text-bone/50 font-light tracking-wide leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
