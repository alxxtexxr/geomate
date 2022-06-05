/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, //here add the packages names and set them to false
      };
    }
    config.plugins.push(new webpack.DefinePlugin({ "global.GENTLY": false }));

    return config;
  },
  images: {
    domains: [
      'api.lorem.space',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
    ],
  },
};

module.exports = nextConfig;