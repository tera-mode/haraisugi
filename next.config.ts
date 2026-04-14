import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
