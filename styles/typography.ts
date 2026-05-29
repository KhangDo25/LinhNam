export const typography = {
  heading: {
    family: "var(--font-cormorant)",
    className: "font-[family-name:var(--font-cormorant)]",
    weights: ["300", "400", "500", "600", "700"] as const,
  },
  body: {
    family: "var(--font-inter)",
    className: "font-[family-name:var(--font-inter)]",
  },
  lore: {
    family: "var(--font-cormorant)",
    className:
      "font-[family-name:var(--font-cormorant)] italic tracking-[0.2em]",
  },
  sizes: {
    hero: "text-7xl md:text-[10rem]",
    h1: "text-5xl md:text-7xl",
    h2: "text-4xl md:text-6xl",
    h3: "text-3xl md:text-4xl",
    body: "text-sm md:text-base",
    caption: "text-[10px] tracking-[0.4em] uppercase",
    micro: "text-[9px] tracking-[0.3em] uppercase",
  },
} as const;
