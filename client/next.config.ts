/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Ensure this is enabled for Clerk v4+
  },
}

module.exports = nextConfig
