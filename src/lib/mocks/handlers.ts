import { http, HttpResponse, delay } from 'msw';
import { mockTransactions } from './data';
import type { RetryPaymentResult, Transaction } from '@/lib/types';

interface RetryRequestBody {
  transactionId: string;
}

interface InvoicePathParams {
  id: string;
  [key: string]: string;
}

export const handlers = [
  http.get<never, never, Transaction[]>('/api/transactions', async () => {
    await delay(500);
    return HttpResponse.json(mockTransactions);
  }),

  http.post<never, RetryRequestBody, RetryPaymentResult>(
    '/api/transactions/retry',
    async ({ request }) => {
      const { transactionId } = await request.json();
      await delay(1000 + Math.random() * 3000);
      const status: RetryPaymentResult['status'] =
        Math.random() < 0.2 ? 'failed' : 'success';
      return HttpResponse.json({ transactionId, status });
    }
  ),

  http.get<InvoicePathParams>(
    '/api/transactions/:id/invoice',
    async () => {
      await delay(2000);
      const pdf = new Blob(['%PDF-1.4 mock invoice content'], {
        type: 'application/pdf',
      });
      return new HttpResponse(pdf, {
        headers: { 'Content-Type': 'application/pdf' },
      });
    }
  ),
];
