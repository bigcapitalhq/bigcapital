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

const invoiceMailReceiptCss = css`
  margin: 0 auto;
  border-radius: 5px !important;
  transform: scale(0.9);
  transform-origin: top;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05) !important;
`

export function InvoiceMailReceiptPreviewConnected() {
  return (
    <InvoiceSendMailPreviewWithHeader>
      <Box px={4} pt={8} pb={16}>
        <InvoiceMailReceiptPreviewWithProps
          className={invoiceMailReceiptCss}
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
      subtotal: invoiceMailState?.subtotalFormatted,
      dueDate: invoiceMailState?.dueDateFormatted,
      dueAmount: invoiceMailState?.dueAmountFormatted,
      invoiceNumber: invoiceMailState?.invoiceNo,
      discount: invoiceMailState?.discountAmountFormatted,
      adjustment: invoiceMailState?.adjustmentFormatted,
      items,
      message,
    };
    return <WrappedComponent {...mailReceiptPreviewProps} {...props} />;
  };
};

export const InvoiceMailReceiptPreviewWithProps =
  withInvoiceMailReceiptPreviewProps(InvoiceMailReceiptPreview);
