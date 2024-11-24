import { css } from '@emotion/css';
import { ComponentType, useMemo } from 'react';
import {
  PaymentReceivedMailReceipt,
  PaymentReceivedMailReceiptProps,
} from './PaymentReceivedMailReceipt';
import { PaymentReceivedMailPreviewHeader } from './PaymentReceivedMailPreviewHeader';
import { Stack } from '@/components';
import { useSendPaymentReceivedtMailMessage } from './_hooks';
import { usePaymentReceivedSendMailBoot } from './PaymentReceivedMailBoot';
import { defaultPaymentReceiptMailProps } from './_constants';

export function PaymentReceivedMailPreviewReceipt() {
  return (
    <Stack flex={1}>
      <PaymentReceivedMailPreviewHeader />

      <Stack px={4} py={6}>
        <PaymentReceivedMailReceiptPreviewConnected
          className={css`
            margin: 0 auto;
            border-radius: 5px !important;
            transform: scale(0.9);
            transform-origin: top;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05) !important;
          `}
        />
      </Stack>
    </Stack>
  );
}

/**
 * Injects props from invoice mail state into the InvoiceMailReceiptPreview component.
 */
const withPaymentReceivedMailReceiptPreviewProps = <
  P extends PaymentReceivedMailReceiptProps,
>(
  WrappedComponent: ComponentType<P & PaymentReceivedMailReceiptProps>,
) => {
  return function WithInvoiceMailReceiptPreviewProps(props: P) {
    const message = useSendPaymentReceivedtMailMessage();
    const { paymentReceivedMailState } = usePaymentReceivedSendMailBoot();

    const items = useMemo(
      () =>
        paymentReceivedMailState?.entries?.map((entry: any) => ({
          total: entry.paidAmount,
          label: entry.invoiceNumber,
        })),
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

export const PaymentReceivedMailReceiptPreviewConnected =
  withPaymentReceivedMailReceiptPreviewProps(PaymentReceivedMailReceipt);
