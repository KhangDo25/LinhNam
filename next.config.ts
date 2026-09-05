import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',  // ✅ Đã comment
  // trailingSlash: true,  // ✅ Đã comment
  allowedDevOrigins: ['192.168.100.182', 'localhost'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;