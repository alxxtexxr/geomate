/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'api.lorem.space',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
    ],
  },
};

module.exports = nextConfig;