/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverMinification: false,
    serverComponentsExternalPackages: ["@google-cloud/storage"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: `/**`,
      },
    ],
  },
}

export default nextConfig
