'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { downloadInvoice } from '@/lib/api/transactions';
import { Button } from '@/components/ui/Button';

interface DownloadInvoiceButtonProps {
  transactionId: string;
}

export function DownloadInvoiceButton({
  transactionId,
}: DownloadInvoiceButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      const blob = await downloadInvoice(transactionId);
      const url = URL.createObjectURL(blob);

      // Anchor must be appended to the DOM for Safari to honor a
      // programmatic click. Chrome/Firefox don't strictly require it.
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Invoice ${transactionId} downloaded`);
    } catch {
      toast.error('Failed to download invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleDownload}
      isLoading={isGenerating}
      disabled={isGenerating}
    >
      {isGenerating ? 'Generating…' : 'Download Invoice'}
    </Button>
  );
}
