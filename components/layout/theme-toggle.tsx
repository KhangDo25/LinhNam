"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!mounted}
      className={`p-2 border border-gold/25 text-bone/70 hover:text-gold hover:border-gold/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-40 ${className}`}
      aria-label={theme === "dark" ? "Bật sáng" : "Bật tối"}
    >
      {!mounted ? (
        <span className="h-[18px] w-[18px]" aria-hidden />
      ) : theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
