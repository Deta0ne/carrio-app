import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' && { exclude: ['error'] },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icelfwwfakovrgbqfwhl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  },
};

export default nextConfig;
