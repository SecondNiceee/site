import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone', // Оптимизация для production
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Для работы на reg.ru
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
