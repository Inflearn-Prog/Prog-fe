import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        //보안 헤더 추가
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/((?!auth).*)",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/:1*`,
      },
    ];
  },
};

export default nextConfig;
