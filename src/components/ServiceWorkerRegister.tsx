'use client';

import { useEffect } from 'react';

// Registers the offline service worker (production builds only, so dev reloads stay predictable).
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('SW registration failed', err));
  }, []);
  return null;
}
