import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  allowedDevOrigins: ["docs.maplefurnishers.com"],
  transpilePackages: ["@maple/core"],
};
export default nextConfig;
