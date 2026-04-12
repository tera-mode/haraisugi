import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/articles',
        destination: '/column',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
