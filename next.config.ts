import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  /**
   * Pin tracing to this app directory (not process.cwd()). Avoids wrong roots when multiple
   * lockfiles exist, and matches Vercel single-package checkout without Turbopack path issues.
   */
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
