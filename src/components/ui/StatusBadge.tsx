import type { TransactionStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: TransactionStatus;
}

const STATUS_STYLES: Record<
  TransactionStatus,
  { className: string; label: string }
> = {
  success: { className: 'bg-green-100 text-green-800', label: 'Success' },
  failed: { className: 'bg-red-100 text-red-800', label: 'Failed' },
  pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { className, label } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
