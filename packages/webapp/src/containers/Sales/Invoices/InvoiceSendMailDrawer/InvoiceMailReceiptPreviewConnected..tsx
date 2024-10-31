import { useMemo } from 'react';
import { css } from '@emotion/css';
import { Box, } from '@/components';
import { InvoiceMailReceiptPreview } from '../InvoiceCustomize/InvoiceMailReceiptPreview';
import { useInvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { InvoiceSendMailPreviewWithHeader } from './InvoiceSendMailHeaderPreview';
import { useSendInvoiceMailMessage } from './_hooks';

export function InvoiceMailReceiptPreviewConneceted() {
  const mailMessage = useSendInvoiceMailMessage();
  const { invoiceMailState } = useInvoiceSendMailBoot();

  const items = useMemo(
    () =>
      invoiceMailState?.entries?.map((entry: any) => ({
        quantity: entry.quantity,
        total: entry.totalFormatted,
        label: entry.name,
      })),
    [invoiceMailState?.entries],
  );

  return (
    <InvoiceSendMailPreviewWithHeader>
      <Box px={4} pt={8} pb={16}>
        <InvoiceMailReceiptPreview
          companyName={invoiceMailState?.companyName}
          // companyLogoUri={invoiceMailState?.companyLogoUri}

          primaryColor={invoiceMailState?.primaryColor}
          total={invoiceMailState?.totalFormatted}
          dueDate={invoiceMailState?.dueDateFormatted}
          dueAmount={invoiceMailState?.dueAmountFormatted}

          invoiceNumber={invoiceMailState?.invoiceNo}
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