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

  // Optimization settings
  swcMinify: true, // Use SWC instead of Terser for minification

  // Keep webpack config minimal
  webpack: (config) => {
    // Turn off persistent caching to avoid serialization issues
    config.cache = false;

    return config;
  },
};

export default nextConfig;
