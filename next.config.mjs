/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static site: export to dist/ (the folder the Cloudflare Pages project already publishes).
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true },
  // Phaser's ESM build has no default export, but the game code uses `import Phaser from 'phaser'`.
  // Point the bare specifier at the UMD build, which does.
  turbopack: {
    resolveAlias: {
      phaser: 'phaser/dist/phaser.js',
    },
  },
};

export default nextConfig;
