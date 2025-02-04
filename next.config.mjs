import crypto from 'crypto';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // For Telegram WebApp
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow CORS for development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,HEAD,PUT,PATCH,POST,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          // Security headers
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self' telegram.org *.telegram.org; script-src 'self' 'unsafe-inline' 'unsafe-eval' telegram.org *.telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: telegram.org *.telegram.org; connect-src 'self' telegram.org *.telegram.org;" 
          },
        ],
      },
    ]
  },
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'telegram.org',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
  // Production optimizations
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@twa-dev/sdk'],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/src',
    }

    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: {
              name: 'vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          },
        },
      }
    }

    return config
  },
}

export default nextConfig 