import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/lib/mocks/server';
import { renderWithProviders } from '@/test/utils';
import { TransactionsTable } from './TransactionsTable';
import type { Transaction } from '@/lib/types';

const TEST_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_test_1',
    amount: 9.99,
    currency: 'USD',
    date: '2025-11-08T14:34:00Z',
    status: 'success',
    description: 'Monthly subscription – Basic',
  },
  {
    id: 'txn_test_2',
    amount: 14.99,
    currency: 'USD',
    date: '2025-11-07T10:15:00Z',
    status: 'failed',
    description: 'Monthly subscription – Premium',
  },
  {
    id: 'txn_test_3',
    amount: 4.99,
    currency: 'USD',
    date: '2025-11-06T08:00:00Z',
    status: 'failed',
    description: 'Sports add-on – Monthly',
  },
  {
    id: 'txn_test_4',
    amount: 19.99,
    currency: 'USD',
    date: '2025-11-05T12:00:00Z',
    status: 'pending',
    description: 'Monthly subscription – Premium + Sports',
  },
];

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

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getAllByText('Failed')).toHaveLength(2);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows checkbox only for failed transactions', async () => {
    renderWithProviders(<TransactionsTable />);

    await screen.findByText('txn_test_1');

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);

    const labels = checkboxes.map((cb) => cb.getAttribute('aria-label'));
    expect(labels).toEqual(
      expect.arrayContaining([
        expect.stringContaining('txn_test_2'),
        expect.stringContaining('txn_test_3'),
      ])
    );
  });
});
