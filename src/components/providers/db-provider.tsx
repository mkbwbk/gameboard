'use client';

import { useEffect, useState } from 'react';
import { seedDefaultGames } from '@/lib/db/seed';

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedDefaultGames().then(() => setReady(true));

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration failed — app still works without it
      });
    }
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-3xl mb-2">🎮</div>
          <p className="text-sm text-muted-foreground">Loading GameBoard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
