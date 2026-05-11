import type { RetryPaymentResult, Transaction } from '@/lib/types';

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch('/api/transactions');
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.status}`);
  }
  return response.json();
}

export async function retryPayment(
  transactionId: string
): Promise<RetryPaymentResult> {
  const response = await fetch('/api/transactions/retry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId }),
  });
  if (!response.ok) {
    throw new Error(`Failed to retry payment: ${response.status}`);
  }
  return response.json();
}

export async function downloadInvoice(transactionId: string): Promise<Blob> {
  const response = await fetch(`/api/transactions/${transactionId}/invoice`);
  if (!response.ok) {
    throw new Error(`Failed to download invoice: ${response.status}`);
  }
  return response.blob();
}
