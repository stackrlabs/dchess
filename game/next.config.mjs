/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.stackrlabs.xyz",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
