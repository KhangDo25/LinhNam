"use client";

import { useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface RealmScrollFxProps {
  children: React.ReactNode;
  accentVar?: string;
}

export default function RealmScrollFx({
  children,
  accentVar = "--gold",
}: RealmScrollFxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      document.documentElement.style.setProperty("--realm-scroll", String(v));
    });
    return () => unsub();
  }, [progress]);

  return (
    <div ref={ref} style={{ ["--realm-accent" as string]: `var(${accentVar})` }}>
      {children}
    </div>
  );
}
