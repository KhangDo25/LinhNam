import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',  // ✅ Đã comment
  // trailingSlash: true,  // ✅ Đã comment
  allowedDevOrigins: ['192.168.100.182', 'localhost'],
  images: {
    unoptimized: true,
  },
  // Bớt JS gửi xuống client: framer-motion chỉ dùng cho animation trang trí,
  // tách ra chunk riêng để các trang shop/tài khoản/admin load nhẹ.
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'gsap'],
  },
};

export default nextConfig;