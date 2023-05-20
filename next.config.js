const withPWA = require("@imbios/next-pwa")({
  dest: "public",
  customWorkerDir: "src/worker",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = withPWA(nextConfig);
