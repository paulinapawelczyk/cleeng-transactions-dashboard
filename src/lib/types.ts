export type TransactionStatus = 'success' | 'failed' | 'pending';

/**
 * A payment transaction.
 *
 * `date` is an ISO 8601 string rather than a `Date` because this shape
 * mirrors what a real REST API would return: JSON has no `Date` type,
 * so dates cross the wire as strings. The mock layer preserves that
 * contract so consumers (TanStack Query cache, MSW handlers, tests)
 * never have to special-case the mock vs. a real backend.
 */
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: TransactionStatus;
  description: string;
}

export interface RetryPaymentResult {
  transactionId: string;
  status: 'success' | 'failed';
}
