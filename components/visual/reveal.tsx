"use client";

import { motion, Variants } from "framer-motion";

type RevealDirection = "up" | "down" | "left" | "right";

type RevealProps = {
  children: React.ReactNode;

  direction?: RevealDirection;

  delay?: number;

  duration?: number;

  blur?: boolean;

  distance?: number;

  className?: string;

  once?: boolean;
};

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1.2,
  blur = true,
  distance = 80,
  className = "",
  once = false,
}: RevealProps) {

  /*
    Motion directions
    --------------------------------
    up    => từ dưới bay lên
    down  => từ trên bay xuống
    left  => từ phải bay vào
    right => từ trái bay vào
  */

  const directions = {
    up: { y: distance, x: 0 },

    down: { y: -distance, x: 0 },

    left: { x: distance, y: 0 },

    right: { x: -distance, y: 0 },
  };

  /*
    Cinematic variants
  */

  const revealVariants: Variants = {
    hidden: {
      opacity: 0,

      scale: 0.96,

      filter: blur ? "blur(12px)" : "blur(0px)",

      ...directions[direction],
    },

    visible: {
      opacity: 1,

      x: 0,

      y: 0,

      scale: 1,

      filter: "blur(0px)",

      transition: {
        duration,

        delay,

        ease: [0.16, 1, 0.3, 1] as const,
      },
    },

    exit: {
      opacity: 0,

      scale: 0.98,

      filter: blur ? "blur(10px)" : "blur(0px)",

      ...directions[direction],

      transition: {
        duration: duration * 0.8,

        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{
        once,
        amount: 0.15,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}