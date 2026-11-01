import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { AdjustmentTotalLine } from '../../Invoices/InvoiceForm/AdjustmentTotalLine';
import { DiscountTotalLine } from '../../Invoices/InvoiceForm/DiscountTotalLine';
import {
  useReceiptAdjustmentFormatted,
  useReceiptDiscountAmountFormatted,
  useReceiptDueAmountFormatted,
  useReceiptPaidAmountFormatted,
  useReceiptSubtotalFormatted,
  useReceiptTotalFormatted,
} from './utils';
import type { ReceiptFormValues } from './utils';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';

export function ReceiptFormFooterRight() {
  const {
    values: { currencyCode },
  } = useFormikContext<ReceiptFormValues>();

  const paidAmountFormatted = useReceiptPaidAmountFormatted();
  const dueAmountFormatted = useReceiptDueAmountFormatted();

  const subtotalFormatted = useReceiptSubtotalFormatted();
  const totalFormatted = useReceiptTotalFormatted();

  const discountAmount = useReceiptDiscountAmountFormatted();
  const adjustmentAmount = useReceiptAdjustmentFormatted();

  return (
    <ReceiptTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'receipt_form.label.subtotal'} />}
        value={subtotalFormatted}
      />
      <DiscountTotalLine
        currencyCode={currencyCode}
        discountAmount={discountAmount}
      />
      <AdjustmentTotalLine adjustmentAmount={adjustmentAmount} />
      <TotalLine
        title={<T id={'receipt_form.label.total'} />}
        value={totalFormatted}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={<T id={'receipt_form.label.payment_amount'} />}
        value={paidAmountFormatted}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'receipt_form.label.due_amount'} />}
        value={dueAmountFormatted}
        textStyle={TotalLineTextStyle.Bold}
      />
    </ReceiptTotalLines>
  );
}

const ReceiptTotalLines = styled(TotalLines)`
  --x-color-text: #555;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  width: 100%;
  color: var(--x-color-text);
`;
