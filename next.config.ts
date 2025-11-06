import type { Configuration as WebpackConfig } from 'webpack';
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Webpack configuration
  webpack: (config: WebpackConfig, { isServer }: { isServer: boolean }) => {
    // Handle path aliases
    if (!config.resolve) config.resolve = {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
    };
    
    return config;
  },
};

export default nextConfig;
