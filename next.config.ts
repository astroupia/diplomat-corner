import type { NextConfig } from "next";
import webpack from "webpack";

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

  webpack(config, { isServer }) {
    // Custom rule for image imports (excluding public folder images)
    config.module?.rules?.push({
      test: /\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i,
      issuer: /\.[jt]sx?$/,
      type: "asset/resource",
      generator: {
        filename: "static/images/[name].[hash][ext]",
      },
      exclude: /public\/assets\/images/,
    });

    // Ignore problematic re-export file from image folder (optional)
    config.plugins?.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /.*\/public\/assets\/images\/index\.ts/,
      })
    );

    return config;
  },
};

export default nextConfig;
