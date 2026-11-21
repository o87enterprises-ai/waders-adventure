import type { Viewport } from 'next';

// The game wants a fixed, non-zoomable viewport (the landing page keeps normal zoom).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1a0033',
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
