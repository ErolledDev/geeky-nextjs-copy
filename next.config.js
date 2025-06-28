/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com', 'blogform.netlify.app'],
    formats: ['image/webp', 'image/avif'],
  },
  // Enhanced SEO and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Optimize builds
  swcMinify: true,
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;