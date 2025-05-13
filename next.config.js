/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Turn off strict mode to reduce rendering
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add optimization flags
  swcMinify: true, // Use SWC instead of Terser for minification
  // Minimize webpack processing
  webpack: (config) => {
    config.optimization.minimize = true;
    // Turn off caching to reduce memory requirements
    config.cache = false;

    // Add maximum string size limit to prevent V8 errors
    config.performance = {
      ...config.performance,
      maxAssetSize: 1000000,
      maxEntrypointSize: 1000000,
      hints: false,
    };

    return config;
  },
};

module.exports = nextConfig;
