/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for AWS Amplify hosting
  output: 'export',
  // Disable image optimization for static export (use unoptimized images)
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
