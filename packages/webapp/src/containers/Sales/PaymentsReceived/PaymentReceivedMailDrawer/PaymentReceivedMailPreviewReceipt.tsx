import { css } from '@emotion/css';
import { PaymentReceivedMailReceipt } from './PaymentReceivedMailReceipt';
import { PaymentReceivedMailPreviewHeader } from './PaymentReceivedMailPreviewHeader';
import { Stack } from '@/components';

const defaultPaymentReceiptMailProps = {
  companyName: 'Company Name',
  companyLogoUri: 'https://via.placeholder.com/150',
  primaryColor: 'rgb(0, 82, 204)',
  paymentDate: '2021-01-01',
  paymentDateLabel: 'Payment Date',
  total: '100.00',
  totalLabel: 'Total',
  paymentNumber: '123456',
  paymentNumberLabel: 'Payment #',
  message: 'Thank you for your payment!',
  subtotal: '100.00',
  subtotalLabel: 'Subtotal',
  items: [{ label: 'Invoice 1', total: '100.00' }],
};

export function PaymentReceivedMailPreviewReceipt() {
  return (
    <Stack flex={1}>
      <PaymentReceivedMailPreviewHeader />

      <Stack px={4} py={6}>
        <PaymentReceivedMailReceipt
          {...defaultPaymentReceiptMailProps}
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
