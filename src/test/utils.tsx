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

interface MockObjectURLResult {
  revokeObjectURLCalls: string[];
}

export function mockObjectURL(): MockObjectURLResult {
  const revokeObjectURLCalls: string[] = [];

  // stubGlobal pairs with vi.unstubAllGlobals() in vitest.setup.ts so the
  // original URL is restored after each test — no manual teardown needed
  // in individual test files.
  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn((url: string) => {
      revokeObjectURLCalls.push(url);
    }),
  });

  return { revokeObjectURLCalls };
}
