import { css } from '@emotion/css';
import { ComponentType } from 'react';
import { CreditNoteSendMailPreviewHeader } from './CreditNoteSendMailPreviewHeader';
import {
  CreditNoteSendMailReceipt,
  CreditNoteSendMailReceiptProps,
} from './CreditNoteSendMailReceipt';
import { withCreditNoteMailReceiptPreviewProps } from './withCreditNoteMailReceiptPreviewProps';
import { Stack } from '@/components';

const creditNotePreviewCss = css`
  margin: 0 auto;
  border-radius: 5px !important;
  transform: scale(0.9);
  transform-origin: top;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05) !important;
`;

export const CreditNoteSendMailReceiptPreview = () => {
  return (
    <Stack spacing={0}>
      <CreditNoteSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <CreditNoteSendMailReceiptConnected className={creditNotePreviewCss} />
      </Stack>
    </Stack>
  );
};

const CreditNoteSendMailReceiptConnected =
  withCreditNoteMailReceiptPreviewProps(
    CreditNoteSendMailReceipt,
  ) as ComponentType<Partial<CreditNoteSendMailReceiptProps>>;
