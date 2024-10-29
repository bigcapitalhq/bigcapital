import { Box, Group, Stack } from '@/components';
import { InvoiceMailReceiptPreview } from '../InvoiceCustomize/InvoiceMailReceiptPreview';
import { css } from '@emotion/css';
import { useInvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { useMemo } from 'react';
import { x } from '@xstyled/emotion';
import { InvoiceSendMailPreviewWithHeader } from './InvoiceSendMailHeaderPreview';
import { useSendInvoiceMailMessage } from './_hooks';

export function InvoiceMailReceiptPreviewConneceted() {
  const { invoice } = useInvoiceSendMailBoot();
  const mailMessage = useSendInvoiceMailMessage();

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
    <InvoiceSendMailPreviewWithHeader>
      <Box px={4} pt={8} pb={16}>
        <InvoiceMailReceiptPreview
          total={invoice.total_formatted}
          dueDate={invoice.due_date_formatted}
          invoiceNumber={invoice.invoice_no}
          items={items}
          message={mailMessage}
          className={css`
            margin: 0 auto;
          `}
        />
      </Box>
    </InvoiceSendMailPreviewWithHeader>
  );
}
