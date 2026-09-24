import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upuamerica.org",
      },
    ],
  },
};

export default nextConfig;
