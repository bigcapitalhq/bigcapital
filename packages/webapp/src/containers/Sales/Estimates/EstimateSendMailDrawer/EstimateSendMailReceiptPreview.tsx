import { css } from '@emotion/css';
import { EstimateSendMailReceipt } from './EstimateSendMailReceipt';
import { EstimateSendMailPreviewHeader } from './EstimateSendMailPreviewHeader';
import { Stack } from '@/components';

const defaultEstimateMailReceiptProps = {
  companyName: 'Bigcapital Technology, Inc.',
  companyLogoUri: ' ',

  total: '$1,000.00',
  subtotal: '$1,000.00',
  estimateNumber: 'INV-0001',
  expirationDate: '2 Oct 2024',
  dueAmount: '$1,000.00',
  items: [{ label: 'Web development', total: '$1000.00', quantity: 1 }],
  message: `Hi Ahmed Bouhuolia,

Here's invoice # INV-00002 for $738.30

The amount outstanding of $737.30 is due on 01 Feb 2023.

From your online payment page you can print a PDF or view your outstanding bills.

If you have any questions, please let us know.

Thanks,
Bigcapital`,
};
export const EstimateSendMailReceiptPreview = () => {
  return (
    <Stack>
      <EstimateSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <EstimateSendMailReceipt
          {...defaultEstimateMailReceiptProps}
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
