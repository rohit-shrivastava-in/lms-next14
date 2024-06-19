/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com"
      },
      {
        protocol: "https",
        hostname: "utfs.io"
      },
      {
        protocol: "https",
        hostname: "img.clerk.com"
      },
    ]
  }
};

export default nextConfig;
