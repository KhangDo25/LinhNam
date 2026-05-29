"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function HeroBackgroundCinematic() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      decay: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(Math.random() * 0.6 + 0.2); 
        this.alpha = Math.random() * 0.5 + 0.2;
        this.decay = Math.random() * 0.002 + 0.001; 
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.alpha > this.decay) {
          this.alpha -= this.decay;
        } else {
          this.y = canvas!.height + Math.random() * 50;
          this.x = Math.random() * canvas!.width;
          this.alpha = Math.random() * 0.5 + 0.2;
          this.size = Math.random() * 2 + 0.5;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "#C6A972";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#C6A972";
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
      }
    };
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#030303] pointer-events-none">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,169,114,0.06)_0%,transparent_60%)] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,230,118,0.02)_0%,transparent_50%)]" /> 
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(0,191,255,0.02)_0%,transparent_50%)]" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen opacity-70" />

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.15] mix-blend-screen" />

      <motion.div 
        animate={{ x: ["-10%", "0%", "-10%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(5,5,5,0)_0%,#030303_80%)] opacity-90 scale-110 blur-xl"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303] opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-[#030303] opacity-100" />

    </div>
  );
}