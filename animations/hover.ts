export const hoverLift = {
  whileHover: { y: -4, scale: 1.02 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 50px rgba(198, 169, 114, 0.2)",
    borderColor: "rgba(198, 169, 114, 0.5)",
  },
  transition: { duration: 0.5 },
};

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.3 },
};

export const cardHoverClass =
  "transition-all duration-700 hover:border-[#C6A972]/60 hover:shadow-[0_0_50px_rgba(198,169,114,0.12)]";
