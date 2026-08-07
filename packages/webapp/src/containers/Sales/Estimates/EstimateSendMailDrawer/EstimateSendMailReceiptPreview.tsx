import { css } from '@emotion/css';
import { ComponentType } from 'react';
import { EstimateSendMailPreviewHeader } from './EstimateSendMailPreviewHeader';
import {
  EstimateSendMailReceipt,
  EstimateSendMailReceiptProps,
} from './EstimateSendMailReceipt';
import { withEstimateMailReceiptPreviewProps } from './withEstimateMailReceiptPreviewProps';
import { Stack } from '@/components';

const estimatePreviewCss = css`
  margin: 0 auto;
  border-radius: 5px !important;
  transform: scale(0.9);
  transform-origin: top;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05) !important;
`;

export const EstimateSendMailReceiptPreview = () => {
  return (
    <Stack spacing={0}>
      <EstimateSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <EstimateSendMailReceiptConnected className={estimatePreviewCss} />
      </Stack>
    </Stack>
  );
};

const EstimateSendMailReceiptConnected = withEstimateMailReceiptPreviewProps(
  EstimateSendMailReceipt,
) as ComponentType<Partial<EstimateSendMailReceiptProps>>;
