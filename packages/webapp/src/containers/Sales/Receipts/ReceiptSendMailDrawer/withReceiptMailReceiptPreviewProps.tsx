import { ComponentType, useMemo } from 'react';
import {
  ReceiptSendMailReceipt,
  ReceiptSendMailReceiptProps,
} from './ReceiptSendMailReceipt';
import { useSendReceiptMailMessage } from './_hooks';
import { useReceiptSendMailBoot } from './ReceiptSendMailBoot';
import { defaultReceiptMailProps } from './_constants';

/**
 * Injects props from receipt mail state into the `ReceiptMailPreviewConnected` component.
 */
export const withReceiptMailReceiptPreviewProps = <
  P extends ReceiptSendMailReceiptProps,
>(
  WrappedComponent: ComponentType<P & ReceiptSendMailReceiptProps>,
) => {
  return function WithInvoiceMailReceiptPreviewProps(props: P) {
    const message = useSendReceiptMailMessage();
    const { receiptMailState } = useReceiptSendMailBoot();

    const items = useMemo(
      () =>
        receiptMailState?.entries?.map((entry: any) => ({
          quantity: entry.quantity,
          total: entry.totalFormatted,
          label: entry.name,
        })),
      [receiptMailState?.entries],
    );

    const mailReceiptPreviewProps = {
      ...defaultReceiptMailProps,
      companyName: receiptMailState?.companyName,
      companyLogoUri: receiptMailState?.companyLogoUri,
      primaryColor: receiptMailState?.primaryColor,
      total: receiptMailState?.totalFormatted,
      subtotal: receiptMailState?.subtotalFormatted,
      receiptNumber: receiptMailState?.receiptNumber,
      discount: receiptMailState?.discountAmountFormatted,
      adjustment: receiptMailState?.adjustmentFormatted,
      items,
      message,
    };
    return <WrappedComponent {...mailReceiptPreviewProps} {...props} />;
  };
};

export const ReceiptMailPreviewConnected = withReceiptMailReceiptPreviewProps(
  ReceiptSendMailReceipt,
) as ComponentType<Partial<ReceiptSendMailReceiptProps>>;
