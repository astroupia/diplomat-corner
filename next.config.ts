import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["diplomatcorner.net"],
    unoptimized: true,
  },

  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build to avoid errors
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
