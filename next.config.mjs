/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
