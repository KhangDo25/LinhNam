export const theme = {
  colors: {
    gold: "#C6A972",
    void: "#050507",
    bone: "#E8E0D0",
    background: "#0B0B0F",
    crimson: "#7A1F1F",
    jade: "#2D4F4A",
    parchment: "#E8E0D0",
    abyss: "#030303",
    mist: "#1A1A22",
    celestial: "#FDFBF7",
    shadow: "#4A4238",
    blood: "#800000",
    ember: "#C45C2E",
    ocean: "#4A7A9B",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    section: "12rem",
    hero: "100vh",
  },
  glow: {
    gold: "0 0 40px rgba(198, 169, 114, 0.25)",
    goldSoft: "0 0 20px rgba(198, 169, 114, 0.12)",
    crimson: "0 0 50px rgba(128, 0, 0, 0.2)",
    jade: "0 0 40px rgba(45, 79, 74, 0.25)",
    void: "0 0 60px rgba(0, 0, 0, 0.8)",
  },
  shadows: {
    card: "0 20px 50px rgba(198, 169, 114, 0.08)",
    cardHover: "0 0 50px rgba(198, 169, 114, 0.15)",
    nav: "0 10px 30px rgba(0, 0, 0, 0.4)",
    deep: "0 40px 80px rgba(0, 0, 0, 0.5)",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
    base: "300ms cubic-bezier(0.16, 1, 0.3, 1)",
    slow: "700ms cubic-bezier(0.16, 1, 0.3, 1)",
    cinematic: "1200ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type Theme = typeof theme;

// Backward compatibility
export const colors = theme.colors;
