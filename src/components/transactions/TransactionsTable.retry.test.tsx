import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { server } from '@/lib/mocks/server';
import { renderWithProviders } from '@/test/utils';
import { TEST_TRANSACTIONS } from '@/test/fixtures';
import { TransactionsTable } from './TransactionsTable';

describe('TransactionsTable retry flow', () => {
  beforeEach(() => {
    server.use(
      http.get('/api/transactions', () =>
        HttpResponse.json(TEST_TRANSACTIONS)
      )
    );
  });

  it('runs retries concurrently and updates each row independently', async () => {
    // Per-id deterministic outcomes. 50ms spread is enough to observe
    // staggered resolution under JSDOM; bump if this becomes flaky.
    const retryPlan = new Map([
      ['txn_test_2', { delay: 50, status: 'success' as const }],
      ['txn_test_3', { delay: 100, status: 'failed' as const }],
      ['txn_test_4', { delay: 150, status: 'success' as const }],
    ]);

    server.use(
      http.post<never, { transactionId: string }>(
        '/api/transactions/retry',
        async ({ request }) => {
          const { transactionId } = await request.json();
          const plan = retryPlan.get(transactionId);
          if (!plan) {
            return new HttpResponse(null, { status: 500 });
          }
          await delay(plan.delay);
          return HttpResponse.json({
            transactionId,
            status: plan.status,
          });
        }
      )
    );

    renderWithProviders(<TransactionsTable />);
    await screen.findByText('txn_test_2');

    const user = userEvent.setup();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);

    for (const checkbox of checkboxes) {
      await user.click(checkbox);
    }

    const retryButton = screen.getByRole('button', {
      name: /Retry Selected \(3\)/,
    });
    expect(retryButton).toBeEnabled();

    await user.click(retryButton);

    // All three rows enter retrying state on click (state init is batched).
    // True concurrency is verified below by the staggered resolution timing.
    const retryingTexts = await screen.findAllByText('Retrying…');
    expect(retryingTexts).toHaveLength(3);

    // After ~50ms: txn_test_2 resolves while others still in flight.
    // Sequential retries would have all 3 still retrying here (because
    // txn_test_3 hadn't even started). THIS is the concurrency proof.
    await waitFor(
      () => {
        expect(screen.queryAllByText('Retrying…')).toHaveLength(2);
      },
      { timeout: 500 }
    );

    // After ~150ms: all settled.
    await waitFor(
      () => {
        expect(screen.queryAllByText('Retrying…')).toHaveLength(0);
      },
      { timeout: 1000 }
    );

    const getRowByTransactionId = (id: string): HTMLElement => {
      const cell = screen.getByText(id);
      const row = cell.closest('tr');
      if (!row) throw new Error(`Row for ${id} not found`);
      return row;
    };

    expect(
      within(getRowByTransactionId('txn_test_2')).getByText('Success')
    ).toBeInTheDocument();
    expect(
      within(getRowByTransactionId('txn_test_3')).getByText('Failed')
    ).toBeInTheDocument();
    expect(
      within(getRowByTransactionId('txn_test_4')).getByText('Success')
    ).toBeInTheDocument();

    expect(
      within(getRowByTransactionId('txn_test_2')).queryByRole('checkbox')
    ).not.toBeInTheDocument();
    expect(
      within(getRowByTransactionId('txn_test_3')).getByRole('checkbox')
    ).toBeInTheDocument();
    expect(
      within(getRowByTransactionId('txn_test_4')).queryByRole('checkbox')
    ).not.toBeInTheDocument();

    // Selection cleared, button reset.
    expect(
      screen.getByRole('button', { name: /^Retry Selected$/ })
    ).toBeDisabled();
  });
});
