/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Ensure this is enabled for Clerk v4+
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
}

module.exports = nextConfig
