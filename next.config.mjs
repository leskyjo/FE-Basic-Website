/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for AWS Amplify SSR deployment
  output: 'standalone',
  // Disable image optimization for simpler deployment
  images: {
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Disable React strict mode to prevent double renders and HMR issues in dev
  reactStrictMode: false,
};

export default nextConfig;
