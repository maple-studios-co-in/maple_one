import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["@maple/core", "@maple/db"],
  serverExternalPackages: ["pdf-to-img", "@napi-rs/canvas", "pdfjs-dist", "sharp"],
};
export default nextConfig;
