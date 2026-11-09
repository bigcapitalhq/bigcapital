import { css } from '@emotion/css';
import { ComponentType } from 'react';
import { PaymentReceivedMailPreviewHeader } from './PaymentReceivedMailPreviewHeader';
import {
  PaymentReceivedMailReceipt,
  PaymentReceivedMailReceiptProps,
} from './PaymentReceivedMailReceipt';
import { withPaymentReceivedMailReceiptPreviewProps } from './withPaymentReceivedMailReceiptPreviewProps';
import { Stack } from '@/components';

const mailReceiptCss = css`
  margin: 0 auto;
  border-radius: 5px !important;
  transform: scale(0.9);
  transform-origin: top;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05) !important;
`;

export function PaymentReceivedMailPreviewReceipt() {
  return (
    <Stack flex={1} spacing={0}>
      <PaymentReceivedMailPreviewHeader />

      <Stack px={4} py={6}>
        <PaymentReceivedMailReceiptPreviewConnected
          className={mailReceiptCss}
        />
      </Stack>
    </Stack>
  );
}

export const PaymentReceivedMailReceiptPreviewConnected =
  withPaymentReceivedMailReceiptPreviewProps(
    PaymentReceivedMailReceipt,
  ) as ComponentType<Partial<PaymentReceivedMailReceiptProps>>;
