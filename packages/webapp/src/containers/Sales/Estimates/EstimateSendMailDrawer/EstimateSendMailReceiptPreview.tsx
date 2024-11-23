import { css } from '@emotion/css';
import { ComponentType, useMemo } from 'react';
import { EstimateSendMailReceipt, EstimateSendMailReceiptProps } from './EstimateSendMailReceipt';
import { EstimateSendMailPreviewHeader } from './EstimateSendMailPreviewHeader';
import { Stack } from '@/components';
import { useEstimateSendMailBoot } from './EstimateSendMailBoot';
import { useSendEstimateMailMessage } from './hooks';
import { defaultEstimateMailReceiptProps } from './_constants';


export const EstimateSendMailReceiptPreview = () => {
  return (
    <Stack>
      <EstimateSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <EstimateSendMailReceiptConnected
          className={css`
            margin: 0 auto;
            border-radius: 5px !important;
            transform: scale(0.9);
            transform-origin: top;
            boxshadow: 0 10px 15px rgba(0, 0, 0, 0.05) !important;
          `}
        />
      </Stack>
    </Stack>
  );
};

/**
 * Injects props from estimate mail state into the `EstimateSendMailReceipt` component.
 */
const withEstimateMailReceiptPreviewProps = <
  P extends EstimateSendMailReceiptProps,
>(
  WrappedComponent: ComponentType<P & EstimateSendMailReceiptProps>,
) => {
  return function WithInvoiceMailReceiptPreviewProps(props: P) {
    const { estimateMailState } = useEstimateSendMailBoot();
    const message = useSendEstimateMailMessage();

    const items = useMemo(
      () =>
        estimateMailState?.entries?.map((entry: any) => ({
          quantity: entry.quantity,
          total: entry.totalFormatted,
          label: entry.name,
        })),
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
      items,
      message
    };
    return <WrappedComponent {...mailReceiptPreviewProps} {...props} />;
  };
};
const EstimateSendMailReceiptConnected = withEstimateMailReceiptPreviewProps(
  EstimateSendMailReceipt
);
