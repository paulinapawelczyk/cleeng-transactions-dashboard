import { TransactionsTable } from '@/components/transactions/TransactionsTable';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Transactions</h1>
      <p className="mb-6 text-sm text-gray-600">
        Review your transaction history, retry failed payments, and download invoices.
      </p>
      <TransactionsTable />
    </div>
  );
}
