import { ComponentType } from 'react';
import { css } from '@emotion/css';
import { Stack } from '@/components';
import { ReceiptSendMailPreviewHeader } from './ReceiptSendMailPreviewHeader';
import {
  ReceiptSendMailReceipt,
  ReceiptSendMailReceiptProps,
} from './ReceiptSendMailReceipt';
import { defaultReceiptMailProps } from './_constants';
import { useReceiptSendMailBoot } from './ReceiptSendMailBoot';
import { useSendReceiptMailMessage } from './_hooks';

export function ReceiptSendMailPreview() {
  return (
    <Stack>
      <ReceiptSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <ReceiptMailPreviewConnected
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
 * Injects props from receipt mail state into the `ReceiptMailPreviewConnected` component.
 */
const withReceiptMailReceiptPreviewProps = <
  P extends ReceiptSendMailReceiptProps,
>(
  WrappedComponent: ComponentType<P & ReceiptSendMailReceiptProps>,
) => {
  return function WithInvoiceMailReceiptPreviewProps(props: P) {
    const message = useSendReceiptMailMessage();
    const { receiptMailState } = useReceiptSendMailBoot();

    // const items = useMemo(
    //   () =>
    //     invoiceMailState?.entries?.map((entry: any) => ({
    //       quantity: entry.quantity,
    //       total: entry.totalFormatted,
    //       label: entry.name,
    //     })),
    //   [invoiceMailState?.entries],
    // );

    const mailReceiptPreviewProps = {
      ...defaultReceiptMailProps,
      // companyName: receiptMailState?.companyName,
      // companyLogoUri: receiptMailState?.companyLogoUri,
      // primaryColor: receiptMailState?.primaryColor,
      // total: receiptMailState?.totalFormatted,
      // dueDate: receiptMailState?.dueDateFormatted,
      // dueAmount: invoiceMailState?.dueAmountFormatted,
      // invoiceNumber: invoiceMailState?.invoiceNo,
      // items,
      message,
    };
    return <WrappedComponent {...mailReceiptPreviewProps} {...props} />;
  };
};

export const ReceiptMailPreviewConnected = withReceiptMailReceiptPreviewProps(
  ReceiptSendMailReceipt,
);
