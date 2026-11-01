import { css } from '@emotion/css';
import { ReceiptSendMailPreviewHeader } from './ReceiptSendMailPreviewHeader';
import { ReceiptMailPreviewConnected } from './withReceiptMailReceiptPreviewProps';
import { Stack } from '@/components';

const receiptPreviewCss = css`
  margin: 0 auto;
  border-radius: 5px !important;
  transform: scale(0.9);
  transform-origin: top;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05) !important;
`;

export function ReceiptSendMailPreview() {
  return (
    <Stack spacing={0}>
      <ReceiptSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <ReceiptMailPreviewConnected className={receiptPreviewCss} />
      </Stack>
    </Stack>
  );
}
