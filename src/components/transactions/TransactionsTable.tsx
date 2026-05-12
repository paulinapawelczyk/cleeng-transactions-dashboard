'use client';

import { useTransactions } from '@/hooks/useTransactions';
import { useTransactionsState } from '@/hooks/useTransactionsState';
import { Spinner } from '@/components/ui/Spinner';
import { TransactionRow } from './TransactionRow';
import { RetrySelectedButton } from './RetrySelectedButton';

const HEADERS = [
  '',
  'Transaction ID',
  'Description',
  'Date',
  'Amount',
  'Status',
  '',
] as const;

export function TransactionsTable() {
  const { data, isLoading, error } = useTransactions();
  const {
    selectedIds,
    toggleSelection,
    rowRetryState,
    isRetryInProgress,
    retrySelected,
  } = useTransactionsState();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-12">
        <Spinner />
        <span className="text-sm text-gray-600">Loading transactions…</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-red-600">
        Failed to load transactions. Please try again.
      </p>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <RetrySelectedButton
          selectedCount={selectedIds.size}
          isRetryInProgress={isRetryInProgress}
          onRetry={retrySelected}
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {HEADERS.map((label, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data?.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                isSelected={selectedIds.has(t.id)}
                onToggleSelect={() => toggleSelection(t.id)}
                retryState={rowRetryState(t.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
