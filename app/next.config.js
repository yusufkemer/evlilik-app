const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);