import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/lib/mocks/server';
import { renderWithProviders } from '@/test/utils';
import { TEST_TRANSACTIONS } from '@/test/fixtures';
import { TransactionsTable } from './TransactionsTable';

describe('TransactionsTable', () => {
  beforeEach(() => {
    server.use(
      http.get('/api/transactions', () =>
        HttpResponse.json(TEST_TRANSACTIONS)
      )
    );
  });

  it('renders all transactions with correct statuses', async () => {
    renderWithProviders(<TransactionsTable />);

    await screen.findByText('txn_test_1');

    expect(screen.getByText('txn_test_1')).toBeInTheDocument();
    expect(screen.getByText('txn_test_2')).toBeInTheDocument();
    expect(screen.getByText('txn_test_3')).toBeInTheDocument();
    expect(screen.getByText('txn_test_4')).toBeInTheDocument();
    expect(screen.getByText('txn_test_5')).toBeInTheDocument();

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getAllByText('Failed')).toHaveLength(3);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows checkbox only for failed transactions', async () => {
    renderWithProviders(<TransactionsTable />);

    await screen.findByText('txn_test_1');

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);

    const labels = checkboxes.map((cb) => cb.getAttribute('aria-label'));
    expect(labels).toEqual(
      expect.arrayContaining([
        expect.stringContaining('txn_test_2'),
        expect.stringContaining('txn_test_3'),
        expect.stringContaining('txn_test_4'),
      ])
    );
  });
});
