'use client';

import type { Transaction } from '@/lib/types';
import type { RowRetryState } from '@/hooks/useTransactionsState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Spinner } from '@/components/ui/Spinner';
import { formatAmount, formatDate } from './formatters';

interface TransactionRowProps {
  transaction: Transaction;
  isSelected: boolean;
  onToggleSelect: () => void;
  retryState: RowRetryState;
}

export function TransactionRow({
  transaction,
  isSelected,
  onToggleSelect,
  retryState,
}: TransactionRowProps) {
  const isRetrying = retryState.kind === 'retrying';
  const showCheckbox =
    transaction.status === 'failed' && retryState.kind === 'idle';

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-10 px-4 py-3 text-sm">
        {isRetrying ? (
          <Spinner size="sm" />
        ) : showCheckbox ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            aria-label={`Select transaction ${transaction.id} for retry`}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        ) : null}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-gray-600">
        {transaction.id}
      </td>
      <td className="px-4 py-3 text-sm">{transaction.description}</td>
      <td className="px-4 py-3 text-sm">{formatDate(transaction.date)}</td>
      <td className="px-4 py-3 text-right text-sm font-medium">
        {formatAmount(transaction.amount, transaction.currency)}
      </td>
      <td className="px-4 py-3 text-sm">
        {isRetrying ? (
          <span className="inline-flex items-center gap-2 text-xs text-gray-600">
            <Spinner size="sm" />
            Retrying…
          </span>
        ) : (
          <StatusBadge status={transaction.status} />
        )}
      </td>
      <td className="w-32 px-4 py-3 text-sm" />
    </tr>
  );
}
