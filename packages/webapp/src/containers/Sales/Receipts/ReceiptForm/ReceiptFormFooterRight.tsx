// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import {
  useReceiptAdjustmentFormatted,
  useReceiptDiscountAmountFormatted,
  useReceiptDueAmountFormatted,
  useReceiptPaidAmountFormatted,
  useReceiptSubtotalFormatted,
  useReceiptTotalFormatted,
} from './utils';
import { DiscountTotalLine } from '../../Invoices/InvoiceForm/DiscountTotalLine';
import { AdjustmentTotalLine } from '../../Invoices/InvoiceForm/AdjustmentTotalLine';

export function ReceiptFormFooterRight() {
  const {
    values: { currency_code },
  } = useFormikContext();

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
        currencyCode={currency_code}
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
  width: 100%;
  color: #555555;
`;
