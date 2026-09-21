/** @type {import('next').NextConfig} */
const apiOrigin = process.env.API_PROXY_TARGET || "http://127.0.0.1:8080";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${apiOrigin}/health`,
      },
    ];
  },
};

export default nextConfig;
