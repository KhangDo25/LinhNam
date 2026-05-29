"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] uppercase tracking-[0.35em] text-[#C6A972]/70"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full border border-[#C6A972]/20 bg-[#0B0B0F]/60 px-4 py-3 text-sm text-[#E8E0D0] placeholder:text-[#E8E0D0]/30 outline-none transition-all duration-300 focus:border-[#C6A972]/60 focus:shadow-[0_0_20px_rgba(198,169,114,0.1)]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
