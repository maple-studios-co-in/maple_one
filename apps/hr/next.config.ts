import type { NextConfig } from "next";
const nextConfig: NextConfig = { transpilePackages: ["@maple/core", "@maple/db"] };
export default nextConfig;
