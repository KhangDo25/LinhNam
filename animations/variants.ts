import { Variants } from "framer-motion";
export const statsVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const cardVariants = (direction: number): Variants => ({
  hidden: {
    opacity: 0,
    x: direction,
    scale: 0.9,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const, 
    },
  },
});