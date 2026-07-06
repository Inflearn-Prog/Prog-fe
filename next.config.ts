import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
      "@radix-ui/react-toast",
    ],
  },
};

export default nextConfig;
