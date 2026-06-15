import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["@maple/core", "@maple/db"],
  serverExternalPackages: ["sharp"],
};
export default nextConfig;
