import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Add more specific hosts instead of '**' wildcard
    ],
  },
  trailingSlash: true,
  compress: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'js-yaml'];
    }
    return config;
  },
};

module.exports = nextConfig;