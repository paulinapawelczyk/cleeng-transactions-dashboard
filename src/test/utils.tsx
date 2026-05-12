import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react';
import { Toaster } from 'sonner';
import { vi } from 'vitest';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  });
}

interface RenderWithProvidersOptions {
  queryClient?: QueryClient;
}

interface RenderWithProvidersResult extends RenderResult {
  queryClient: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {}
): RenderWithProvidersResult {
  const queryClient = options.queryClient ?? createTestQueryClient();
  const result = render(
    <QueryClientProvider client={queryClient}>
      {ui}
      <Toaster />
    </QueryClientProvider>
  );
  return { ...result, queryClient };
}

export function mockObjectURL(): { revokeObjectURLCalls: string[] } {
  const revokeObjectURLCalls: string[] = [];

  // JSDOM doesn't implement these natively – assign safe defaults so
  // vi.spyOn has something to wrap. Idempotent: skips assignment if
  // another test already set them.
  if (typeof URL.createObjectURL !== 'function') {
    URL.createObjectURL = () => '';
  }
  if (typeof URL.revokeObjectURL !== 'function') {
    URL.revokeObjectURL = () => {};
  }

  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation((url) => {
    revokeObjectURLCalls.push(url);
  });

  return { revokeObjectURLCalls };
}
