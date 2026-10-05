import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native/worker-based PDF rendering must load from node_modules, not the bundle
  serverExternalPackages: ['@napi-rs/canvas', 'unpdf'],
  async redirects() {
    return [
      // Products was merged into Services
      { source: '/products', destination: '/services', permanent: true },
    ];
  },
};

export default nextConfig;
