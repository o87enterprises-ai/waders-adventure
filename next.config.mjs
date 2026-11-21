/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Phaser's ESM build has no default export, but the game code uses `import Phaser from 'phaser'`.
  // Point the bare specifier at the UMD build, which does.
  turbopack: {
    resolveAlias: {
      phaser: 'phaser/dist/phaser.js',
    },
  },
};

export default nextConfig;
