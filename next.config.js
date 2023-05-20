// https://github.com/Schular/next-with-pwa/blob/main/next.config.js

const path = require("path");
const withPWAInit = require("@imbios/next-pwa");

/** @type {import('@imbios/next-pwa').PWAConfig} */
const withPWA = withPWAInit({
  disable: process.env.NODE_ENV !== "production",
  dest: "public",
  // Solution: https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1399683017
  buildExcludes: ["app-build-manifest.json"],
});

const generateAppDirEntry = (entry) => {
  const packagePath = require.resolve("@imbios/next-pwa");
  const packageDirectory = path.dirname(packagePath);
  const registerJs = path.join(packageDirectory, "register.js");

  return entry().then((entries) => {
    // Register SW on App directory, solution: https://github.com/shadowwalker/next-pwa/pull/427
    if (entries["main-app"] && !entries["main-app"].includes(registerJs)) {
      if (Array.isArray(entries["main-app"])) {
        entries["main-app"].unshift(registerJs);
      } else if (typeof entries["main-app"] === "string") {
        entries["main-app"] = [registerJs, entries["main-app"]];
      }
    }
    return entries;
  });
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      const entry = generateAppDirEntry(config.entry);
      config.entry = () => entry;
    }
    return config;
  },
};

module.exports = withPWA(nextConfig);
