import { Box } from '@/components';
import { InvoiceMailReceiptPreview } from '../InvoiceCustomize/InvoiceMailReceiptPreview';
import { css } from '@emotion/css';
import { useInvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { useMemo } from 'react';

export function InvoiceMailReceiptPreviewConneceted() {
  const { invoice } = useInvoiceSendMailBoot();

  const items = useMemo(
    () =>
      invoice.entries.map((entry: any) => ({
        quantity: entry.quantity,
        total: entry.rate_formatted,
        label: entry.item.name,
      })),
    [invoice.entries],
  );

  return (
    <Box px={4} pt={8} pb={16}>
      <InvoiceMailReceiptPreview
        total={invoice.total_formatted}
        dueDate={invoice.due_date_formatted}
        invoiceNumber={invoice.invoice_no}
        items={items}
        className={css`
          margin: 0 auto;
        `}
      />
    </Box>
  );
}
