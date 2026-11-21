import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wader's Adventure",
    short_name: 'Waders',
    description: 'Learn to read with Wade and Spider-Man!',
    theme_color: '#1a0033',
    background_color: '#000000',
    display: 'standalone',
    orientation: 'landscape',
    // Installed app opens straight into the game, not the landing page.
    start_url: '/play',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
