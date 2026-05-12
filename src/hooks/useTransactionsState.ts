import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { retryPayment } from '@/lib/api/transactions';
import type { Transaction } from '@/lib/types';

export type RowRetryState =
  | { kind: 'idle' }
  | { kind: 'retrying' };

export interface UseTransactionsStateReturn {
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  rowRetryState: (id: string) => RowRetryState;
  isRetryInProgress: boolean;
  retrySelected: () => Promise<void>;
}

const IDLE: RowRetryState = { kind: 'idle' };
const RETRYING: RowRetryState = { kind: 'retrying' };

export function useTransactionsState(): UseTransactionsStateReturn {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [retryStates, setRetryStates] = useState<Map<string, RowRetryState>>(
    () => new Map()
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const rowRetryState = useCallback(
    (id: string): RowRetryState => retryStates.get(id) ?? IDLE,
    [retryStates]
  );

  const isRetryInProgress = useMemo(() => {
    for (const state of retryStates.values()) {
      if (state.kind === 'retrying') return true;
    }
    return false;
  }, [retryStates]);

  const retrySelected = useCallback(async (): Promise<void> => {
    // selectedIds in deps re-creates this callback on selection change.
    // Acceptable here – the callback isn't passed to React.memo'd children
    // or used as effect dep. For a larger component tree, a ref pattern
    // would be preferable.
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setRetryStates((prev) => {
      const next = new Map(prev);
      for (const id of ids) next.set(id, RETRYING);
      return next;
    });

    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const result = await retryPayment(id);
          queryClient.setQueryData<Transaction[]>(['transactions'], (old) =>
            old?.map((t) =>
              t.id === id ? { ...t, status: result.status } : t
            )
          );
        } catch {
          queryClient.setQueryData<Transaction[]>(['transactions'], (old) =>
            old?.map((t) =>
              t.id === id ? { ...t, status: 'failed' as const } : t
            )
          );
        }

        setRetryStates((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      })
    );

    setSelectedIds(new Set());
  }, [queryClient, selectedIds]);

  return {
    selectedIds,
    toggleSelection,
    rowRetryState,
    isRetryInProgress,
    retrySelected,
  };
}
