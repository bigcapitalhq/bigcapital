import { Stack } from '@/components';
import { ReceiptSendMailPreviewHeader } from './ReceiptSendMailPreviewHeader';
import { ReceiptSendMailReceipt } from './ReceiptSendMailReceipt';
import { css } from '@emotion/css';

const defaultReceiptMailProps = {
  companyLogoUri: 'https://via.placeholder.com/150',
  companyName: 'Company Name',
  receiptNumber: '1234',
  total: '1000',
  message: 'Thank you for your business!',
  items: [
    { label: 'Item 1', quantity: 1, total: '500' },
    { label: 'Item 2', quantity: 2, total: '500' },
  ],
  subtotal: '1000',
  showViewReceiptButton: true,
  viewReceiptButtonLabel: 'View Receipt',
};

export function ReceiptSendMailPreview() {
  return (
    <Stack>
      <ReceiptSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <ReceiptSendMailReceipt
          {...defaultReceiptMailProps}
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
