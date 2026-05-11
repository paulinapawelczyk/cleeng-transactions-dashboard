'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface MswProviderProps {
  children: ReactNode;
}

export function MswProvider({ children }: MswProviderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { worker } = await import('@/lib/mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Initializing mock API…</p>
      </div>
    );
  }

  return <>{children}</>;
}
