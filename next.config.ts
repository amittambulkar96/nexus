import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static export for pages that use Convex
  output: "standalone",
  // Ensure env vars are available at build time
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || "https://capable-greyhound-314.convex.cloud",
  },
};

export default nextConfig;
