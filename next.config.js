const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meowbored.pro",
      },
      {
        protocol: "https",
        hostname: "meowbored.pro",
      },
    ],
  },
};
module.exports = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};
