'use client';

import { Button } from '@/components/ui/Button';

interface RetrySelectedButtonProps {
  selectedCount: number;
  isRetryInProgress: boolean;
  onRetry: () => void;
}

export function RetrySelectedButton({
  selectedCount,
  isRetryInProgress,
  onRetry,
}: RetrySelectedButtonProps) {
  const label =
    selectedCount > 0
      ? `Retry Selected (${selectedCount})`
      : 'Retry Selected';

  return (
    <Button
      variant="primary"
      onClick={onRetry}
      disabled={selectedCount === 0 || isRetryInProgress}
      isLoading={isRetryInProgress}
    >
      {label}
    </Button>
  );
}
