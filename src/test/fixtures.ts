import type { Transaction } from '@/lib/types';

export const TEST_TRANSACTIONS: Transaction[] = [
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
    amount: 24.99,
    currency: 'USD',
    date: '2025-11-05T12:00:00Z',
    status: 'failed',
    description: 'Family plan upgrade',
  },
  {
    id: 'txn_test_5',
    amount: 19.99,
    currency: 'USD',
    date: '2025-11-04T09:00:00Z',
    status: 'pending',
    description: 'Monthly subscription – Premium + Sports',
  },
];
