import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
  /**
   * Pin tracing to this app directory (not process.cwd()). Avoids wrong roots when multiple
   * lockfiles exist, and matches Vercel single-package checkout without Turbopack path issues.
   */
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
