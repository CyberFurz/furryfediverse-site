/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enable ISR in production
    isrMemoryCacheSize: 0,
  },
  // Ensure static generation works with ISR
  output: 'standalone',
  // Docker-friendly settings
  poweredByHeader: false,
  compress: true,
  // Ensure proper host binding for Docker
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
        ],
      },
    ]
  },
}

module.exports = nextConfig
