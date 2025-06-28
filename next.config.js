/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enable ISR in production
    isrMemoryCacheSize: 0,
  },
  // Ensure static generation works with ISR
  output: 'standalone',
}

module.exports = nextConfig
