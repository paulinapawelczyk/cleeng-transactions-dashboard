import { useCallback, useMemo, useState } from 'react';

export type RowRetryState =
  | { kind: 'idle' }
  | { kind: 'retrying' };

export interface UseTransactionsStateReturn {
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  rowRetryState: (id: string) => RowRetryState;
  isRetryInProgress: boolean;
  retrySelected: () => Promise<void>;
}

const IDLE: RowRetryState = { kind: 'idle' };

export function useTransactionsState(): UseTransactionsStateReturn {
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

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
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
    console.log('retry called');
  }, []);

  return {
    selectedIds,
    toggleSelection,
    clearSelection,
    rowRetryState,
    isRetryInProgress,
    retrySelected,
  };
}
