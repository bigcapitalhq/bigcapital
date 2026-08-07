import { ComponentType, useMemo } from 'react';
import { defaultEstimateMailReceiptProps } from './_constants';
import { useEstimateSendMailBoot } from './EstimateSendMailBoot';
import { EstimateSendMailReceiptProps } from './EstimateSendMailReceipt';
import { useSendEstimateMailMessage } from './hooks';

/**
 * Injects props from estimate mail state into the `EstimateSendMailReceipt` component.
 */
export const withEstimateMailReceiptPreviewProps = <
  P extends EstimateSendMailReceiptProps,
>(
  WrappedComponent: ComponentType<P & EstimateSendMailReceiptProps>,
) => {
  return function WithInvoiceMailReceiptPreviewProps(props: P) {
    const { estimateMailState } = useEstimateSendMailBoot();
    const message = useSendEstimateMailMessage();

    const items = useMemo(
      () =>
        estimateMailState?.entries?.map(
          (entry: {
            quantity?: number;
            totalFormatted?: string;
            name?: string;
          }) => ({
            quantity: entry.quantity,
            total: entry.totalFormatted,
            label: entry.name,
          }),
        ),
      [estimateMailState?.entries],
    );

    const mailReceiptPreviewProps = {
      ...defaultEstimateMailReceiptProps,
      companyName: estimateMailState?.companyName,
      companyLogoUri: estimateMailState?.companyLogoUri,
      primaryColor: estimateMailState?.primaryColor,
      total: estimateMailState?.totalFormatted,
      expirationDate: estimateMailState?.expirationDateFormatted,
      estimateNumber: estimateMailState?.estimateNumber,
      estimateDate: estimateMailState?.estimateDateFormatted,
      subtotal: estimateMailState?.subtotalFormatted,
      discount: estimateMailState?.discountAmountFormatted,
      adjustment: estimateMailState?.adjustmentFormatted,
      items,
      message,
    };
    return <WrappedComponent {...mailReceiptPreviewProps} {...props} />;
  };
};
