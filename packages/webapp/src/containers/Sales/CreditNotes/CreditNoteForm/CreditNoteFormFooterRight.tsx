import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { AdjustmentTotalLine } from '../../Invoices/InvoiceForm/AdjustmentTotalLine';
import { DiscountTotalLine } from '../../Invoices/InvoiceForm/DiscountTotalLine';
import {
  useCreditNoteAdjustmentFormatted,
  useCreditNoteDiscountAmountFormatted,
  useCreditNoteSubtotalFormatted,
  useCreditNoteTotalFormatted,
} from './utils';
import type { CreditNoteFormValues } from './utils';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';

export function CreditNoteFormFooterRight() {
  const {
    values: { currencyCode },
  } = useFormikContext<CreditNoteFormValues>();

  const subtotalFormatted = useCreditNoteSubtotalFormatted();
  const totalFormatted = useCreditNoteTotalFormatted();
  const discountAmount = useCreditNoteDiscountAmountFormatted();
  const adjustmentAmount = useCreditNoteAdjustmentFormatted();

  return (
    <CreditNoteTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'credit_note.label_subtotal'} />}
        value={subtotalFormatted}
        borderStyle={TotalLineBorderStyle.SingleDark}
      />
      <DiscountTotalLine
        currencyCode={currencyCode}
        discountAmount={discountAmount}
      />
      <AdjustmentTotalLine adjustmentAmount={adjustmentAmount} />
      <TotalLine
        title={<T id={'credit_note.label_total'} />}
        value={totalFormatted}
        textStyle={TotalLineTextStyle.Bold}
      />
    </CreditNoteTotalLines>
  );
}

const CreditNoteTotalLines = styled(TotalLines)`
  --x-color-text: #555555;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  width: 100%;
  color: var(--x-color-text);
`;
