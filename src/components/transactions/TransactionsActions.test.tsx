import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { server } from '@/lib/mocks/server';
import { mockObjectURL, renderWithProviders } from '@/test/utils';
import { TEST_TRANSACTIONS } from '@/test/fixtures';
import { TransactionsTable } from './TransactionsTable';

describe('TransactionsTable actions', () => {
  let revokeObjectURLCalls: string[];

  beforeEach(() => {
    server.use(
      http.get('/api/transactions', () =>
        HttpResponse.json(TEST_TRANSACTIONS)
      )
    );
    ({ revokeObjectURLCalls } = mockObjectURL());
  });

  it('retry selected button reflects selection count and disables appropriately', async () => {
    renderWithProviders(<TransactionsTable />);
    await screen.findByText('txn_test_2');

    const user = userEvent.setup();

    expect(
      screen.getByRole('button', { name: /^Retry Selected$/ })
    ).toBeDisabled();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);

    await user.click(checkboxes[0]);
    expect(
      screen.getByRole('button', { name: /^Retry Selected \(1\)$/ })
    ).toBeEnabled();

    await user.click(checkboxes[1]);
    expect(
      screen.getByRole('button', { name: /^Retry Selected \(2\)$/ })
    ).toBeEnabled();

    await user.click(checkboxes[0]); // deselect first
    expect(
      screen.getByRole('button', { name: /^Retry Selected \(1\)$/ })
    ).toBeEnabled();
  });

  it('downloads invoice and shows success toast', async () => {
    // Override the default 2s invoice delay so the test runs fast.
    // Set BEFORE render — overriding after the click would be too late.
    server.use(
      http.get('/api/transactions/:id/invoice', async () => {
        await delay(20);
        return new HttpResponse(
          new Blob(['mock pdf'], { type: 'application/pdf' }),
          { headers: { 'Content-Type': 'application/pdf' } }
        );
      })
    );

    renderWithProviders(<TransactionsTable />);
    await screen.findByText('txn_test_1');

    const firstRow = screen.getByText('txn_test_1').closest('tr');
    if (!firstRow) throw new Error('row missing');

    const downloadButton = within(firstRow).getByRole('button', {
      name: /Download Invoice/,
    });

    const user = userEvent.setup();
    await user.click(downloadButton);

    await waitFor(() => {
      expect(within(firstRow).getByText('Generating…')).toBeInTheDocument();
    });

    expect(
      await screen.findByText(/Invoice .* downloaded/)
    ).toBeInTheDocument();

    expect(revokeObjectURLCalls).toContain('blob:mock-url');

    await waitFor(() => {
      expect(within(firstRow).getByText('Download Invoice')).toBeInTheDocument();
    });
  });
});
