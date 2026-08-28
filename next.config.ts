import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@kenresearch/design-system', '@kenresearch/tokens'],
  devIndicators: false,
};

export default nextConfig;
