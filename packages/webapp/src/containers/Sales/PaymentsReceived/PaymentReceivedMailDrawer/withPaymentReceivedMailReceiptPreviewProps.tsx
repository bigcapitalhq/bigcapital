import { ComponentType, useMemo } from 'react';
import { defaultPaymentReceiptMailProps } from './_constants';
import { useSendPaymentReceivedtMailMessage } from './_hooks';
import { usePaymentReceivedSendMailBoot } from './PaymentReceivedMailBoot';
import { PaymentReceivedMailReceiptProps } from './PaymentReceivedMailReceipt';

/**
 * Injects props from invoice mail state into the InvoiceMailReceiptPreview component.
 */
export const withPaymentReceivedMailReceiptPreviewProps = <
  P extends PaymentReceivedMailReceiptProps,
>(
  WrappedComponent: ComponentType<P & PaymentReceivedMailReceiptProps>,
) => {
  return function WithInvoiceMailReceiptPreviewProps(props: P) {
    const message = useSendPaymentReceivedtMailMessage();
    const { paymentReceivedMailState } = usePaymentReceivedSendMailBoot();

    const items = useMemo(
      () =>
        paymentReceivedMailState?.entries?.map(
          (entry: { paidAmount: string; invoiceNumber: string }) => ({
            total: entry.paidAmount,
            label: entry.invoiceNumber,
          }),
        ),
      [paymentReceivedMailState?.entries],
    );

    const mailPaymentReceivedPreviewProps = {
      ...defaultPaymentReceiptMailProps,
      companyName: paymentReceivedMailState?.companyName,
      companyLogoUri: paymentReceivedMailState?.companyLogoUri,
      primaryColor: paymentReceivedMailState?.primaryColor,
      total: paymentReceivedMailState?.totalFormatted,
      subtotal: paymentReceivedMailState?.subtotalFormatted,
      paymentNumber: paymentReceivedMailState?.paymentNumber,
      items,
      message,
    };
    return <WrappedComponent {...mailPaymentReceivedPreviewProps} {...props} />;
  };
};
