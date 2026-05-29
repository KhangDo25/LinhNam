import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/LinhNam',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;