'use client';

import type { Transaction } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatAmount, formatDate } from './formatters';

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-10 px-4 py-3 text-sm" />
      <td className="px-4 py-3 font-mono text-xs text-gray-600">
        {transaction.id}
      </td>
      <td className="px-4 py-3 text-sm">{transaction.description}</td>
      <td className="px-4 py-3 text-sm">{formatDate(transaction.date)}</td>
      <td className="px-4 py-3 text-right text-sm font-medium">
        {formatAmount(transaction.amount, transaction.currency)}
      </td>
      <td className="px-4 py-3 text-sm">
        <StatusBadge status={transaction.status} />
      </td>
      <td className="w-32 px-4 py-3 text-sm" />
    </tr>
  );
}
