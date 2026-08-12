"use client";

import { motion } from "framer-motion";

type Particle = {
  left: number;
  duration: number;
  delay: number;
  drift: number;
  size: number;
};

const particles: Particle[] = Array.from(
  { length: 20 },
  (_, index) => ({
    left: (index * 37.5 + 8) % 100,
    duration: 10 + ((index * 7) % 10),
    delay: (index * 3.7) % 10,
    drift: ((index * 47) % 120) - 60,
    size: 1 + ((index * 13) % 20) / 10,
  })
);

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050507]" />

      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#C6A972]/10
          blur-3xl
        "
      />

      <motion.div
        animate={{
          x: [0, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          left-[-10%]
          top-0
          h-[50vh]
          w-[120%]
          bg-gradient-to-r
          from-transparent
          via-[#ffffff05]
          to-transparent
          blur-3xl
        "
      />

      <motion.div
        animate={{
          x: [0, -120, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          bottom-0
          left-[-10%]
          h-[40vh]
          w-[120%]
          bg-gradient-to-r
          from-transparent
          via-[#C6A972]/5
          to-transparent
          blur-3xl
        "
      />

      {particles.map((particle, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            y: 100,
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: -900,
            x: [0, particle.drift],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
          className="
            absolute
            rounded-full
            bg-[#C6A972]
            shadow-[0_0_10px_rgba(198,169,114,0.5)]
          "
          style={{
            left: `${particle.left}%`,
            bottom: "-20px",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}

      <div
        className="
          absolute
          top-0
          left-1/2
          h-[300px]
          w-[800px]
          -translate-x-1/2
          bg-[#C6A972]/5
          blur-3xl
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_40%,#050507_100%)]
        "
      />
    </div>
  );
}