"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asMotion?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gold/10 border-gold/40 text-gold hover:bg-gold/20 hover:border-gold",
  ghost: "border-transparent text-bone/70 hover:text-gold",
  outline: "border-gold/20 text-bone hover:border-gold/60 hover:text-gold",
  danger: "border-blood/30 text-bone hover:border-blood hover:text-blood",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[10px] tracking-[0.3em]",
  md: "px-6 py-3 text-[11px] tracking-[0.35em]",
  lg: "px-8 py-4 text-xs tracking-[0.4em]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asMotion = true,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 uppercase font-semibold border transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none cursor-hover",
      variants[variant],
      sizes[size],
      className
    );

    if (asMotion) {
      return (
        <motion.button
          ref={ref}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={classes}
          {...(props as HTMLMotionProps<"button">)}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
