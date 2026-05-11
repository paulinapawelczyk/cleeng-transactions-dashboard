import { http, HttpResponse, delay } from 'msw';
import { mockTransactions } from './data';
import type { RetryPaymentResult } from '@/lib/types';

interface RetryRequestBody {
  transactionId: string;
}

export const handlers = [
  http.get('/api/transactions', async () => {
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

  http.get<{ id: string }>(
    '/api/transactions/:id/invoice',
    async ({ params }) => {
      const exists = mockTransactions.some((t) => t.id === params.id);
      if (!exists) {
        return new HttpResponse(null, { status: 404 });
      }
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