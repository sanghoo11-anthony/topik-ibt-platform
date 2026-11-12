import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGithubPages
    ? {
        output: "export",
        basePath: "/topik-ibt-platform",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
