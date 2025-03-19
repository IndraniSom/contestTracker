import { NextConfig } from 'next'
const nextConfig = {
  experimental: {
    serverActions: true, 
    middleware: true,
    
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
