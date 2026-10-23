import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ['@workspace/ui'],
  // The registry moved to ui.spaceman.sh. Existing installs resolve items from
  // spaceman.sh/r/{name}.json, so those URLs redirect permanently.
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
