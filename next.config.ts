import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.100.182', 'localhost'],
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'gsap'],
  },
};

export default nextConfig;