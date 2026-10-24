import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ['@workspace/ui'],
  // preserve registry install urls published before the subdomain move
  async redirects() {
    return [
      {
        source: '/r/:path*',
        destination: 'https://ui.spaceman.sh/r/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
