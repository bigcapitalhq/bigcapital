import { useMemo, ComponentType } from 'react';
import { css } from '@emotion/css';
import { Box } from '@/components';
import {
  InvoiceMailReceiptPreview,
  InvoiceMailReceiptPreviewProps,
} from '../InvoiceCustomize/InvoiceMailReceiptPreview';
import { useInvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { InvoiceSendMailPreviewWithHeader } from './InvoiceSendMailHeaderPreview';
import { useSendInvoiceMailMessage } from './_hooks';

export function InvoiceMailReceiptPreviewConnected() {
  return (
    <InvoiceSendMailPreviewWithHeader>
      <Box px={4} pt={8} pb={16}>
        <InvoiceMailReceiptPreviewWithProps
          className={css`
            margin: 0 auto;
          `}
        />
      </Box>
    </InvoiceSendMailPreviewWithHeader>
  );
}

/**
 * Injects props from invoice mail state into the InvoiceMailReceiptPreview component.
 */
const withInvoiceMailReceiptPreviewProps = <
  P extends InvoiceMailReceiptPreviewProps,
>(
  WrappedComponent: ComponentType<P & InvoiceMailReceiptPreviewProps>,
) => {
  return function WithInvoiceMailReceiptPreviewProps(props: P) {
    const message = useSendInvoiceMailMessage();
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

    const mailReceiptPreviewProps = {
      companyName: invoiceMailState?.companyName,
      companyLogoUri: invoiceMailState?.companyLogoUri,
      primaryColor: invoiceMailState?.primaryColor,
      total: invoiceMailState?.totalFormatted,
      dueDate: invoiceMailState?.dueDateFormatted,
      dueAmount: invoiceMailState?.dueAmountFormatted,
      invoiceNumber: invoiceMailState?.invoiceNo,
      items,
      message,
    };
    return <WrappedComponent {...mailReceiptPreviewProps} {...props} />;
  };
};

export const InvoiceMailReceiptPreviewWithProps =
  withInvoiceMailReceiptPreviewProps(InvoiceMailReceiptPreview);
