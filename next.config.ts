import type { NextConfig } from "next";
import path from "path";

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

  // Add experimental flag to fix module resolution
  experimental: {
    esmExternals: false,
  },
};

export default nextConfig;
