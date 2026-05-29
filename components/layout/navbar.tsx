"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenisScroll } from "@/components/providers/lenis-provider";
import AuthNav from "@/components/layout/auth-nav";
import ThemeToggle from "@/components/layout/theme-toggle";

const navItems = [
  { label: "Lục Giới", href: "/#luc-gioi" },
  { label: "Sử Thi", href: "/su-thi" },
  { label: "Huyền Thoại", href: "/huyen-thoai" },
  { label: "Linh Thú", href: "/linh-thu" },
  { label: "Cửa hàng", href: "/cua-hang" },
  { label: "Giới Thiệu", href: "/gioi-thieu" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrolled } = useLenisScroll(30);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full pt-[env(safe-area-inset-top)] transition-[background,border] duration-500 ${
          scrolled
            ? "border-b border-gold/15 bg-background/90 backdrop-blur-md"
            : "bg-background/40 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-14 md:h-20 max-w-7xl items-center justify-between gap-2 px-4 md:px-10">
          <Link href="/" className="shrink-0">
            <h1 className="font-heading text-xl md:text-3xl tracking-[0.2em] md:tracking-[0.3em] text-gold">
              LINH NAM
            </h1>
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle className="md:hidden" />
            <div className="hidden md:block">
              <AuthNav />
            </div>
            <ThemeToggle className="hidden md:flex" />
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-bone md:hidden mobile-touch flex items-center justify-center"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="hidden items-center gap-5 lg:gap-7 md:flex absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative text-[10px] lg:text-[11px] uppercase tracking-[0.25em] text-bone/75 hover:text-gold transition-colors whitespace-nowrap"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col bg-background/98 pt-[calc(3.5rem+env(safe-area-inset-top))] pb-safe px-6 md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 py-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-2xl tracking-wide text-bone hover:text-gold block py-2 mobile-touch"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto border-t border-gold/15 pt-6 space-y-4">
              <AuthNav mobile />
              <div className="flex items-center justify-between">
                <span className="text-xs text-bone/60">Giao diện</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
