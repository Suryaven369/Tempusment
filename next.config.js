/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Change from 'export' to 'standalone'
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      os: false,
      path: false,
      stream: false,
      util: false,
      buffer: false,
      process: false,
    };
    return config;
  },
};

module.exports = nextConfig;