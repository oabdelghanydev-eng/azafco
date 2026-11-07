const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  // Fix for duplicate lockfile warning
  outputFileTracingRoot: __dirname,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'azafco.com.eg',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Permanent redirects for renamed species pages. "buni" was renamed to grass carp
  // (owner species list, 7 Nov 2026); see docs/reports/species-identification.md
  async redirects() {
    return [
      {
        source: '/:locale(ar|en|es|ru|de|fr)/products/buni',
        destination: '/:locale/products/grass-carp',
        permanent: true,
      },
      // Site v2: guides moved into Insights
      { source: '/:locale(ar|en|es|ru|de|fr)/guides', destination: '/:locale/insights', permanent: true },
      { source: '/:locale(ar|en|es|ru|de|fr)/guides/:slug', destination: '/:locale/insights/:slug', permanent: true },
    ]
  },

  // Caching headers for static assets
  async headers() {
    return [
      // Security headers for certificate verification pages
      {
        source: '/v/:token*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(woff|woff2|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)


