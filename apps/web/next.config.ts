import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "../..")
  },
  transpilePackages: [
    "@openvideoui/database",
    "@openvideoui/openrouter",
    "@openvideoui/queue",
    "@openvideoui/shared",
    "@openvideoui/storage"
  ]
};

export default nextConfig;
