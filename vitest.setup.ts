import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/lib/mocks/server';

beforeAll(() => {
  // 'error' surfaces forgotten mocks immediately instead of letting a
  // real fetch leak through and time out somewhere downstream.
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  // Drops any per-test server.use(...) overrides so tests stay isolated.
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
