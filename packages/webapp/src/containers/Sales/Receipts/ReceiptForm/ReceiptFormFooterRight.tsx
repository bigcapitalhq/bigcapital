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
  useReceiptAggregatedTaxRates,
  useReceiptDiscountAmountFormatted,
  useReceiptDueAmountFormatted,
  useReceiptPaidAmountFormatted,
  useReceiptSubtotalFormatted,
  useReceiptTotalFormatted,
} from './utils';
import { DiscountTotalLine } from '../../Invoices/InvoiceForm/DiscountTotalLine';
import { AdjustmentTotalLine } from '../../Invoices/InvoiceForm/AdjustmentTotalLine';
import { TaxType } from '@/interfaces/TaxRates';

export function ReceiptFormFooterRight() {
  const {
    values: { currency_code, inclusive_exclusive_tax },
  } = useFormikContext();

  const paidAmountFormatted = useReceiptPaidAmountFormatted();
  const dueAmountFormatted = useReceiptDueAmountFormatted();

  const subtotalFormatted = useReceiptSubtotalFormatted();
  const totalFormatted = useReceiptTotalFormatted();

  const discountAmount = useReceiptDiscountAmountFormatted();
  const adjustmentAmount = useReceiptAdjustmentFormatted();
  const taxEntries = useReceiptAggregatedTaxRates();

  return (
    <ReceiptTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={
          <>
            {inclusive_exclusive_tax === TaxType.Inclusive
              ? 'Subtotal (Tax Inclusive)'
              : 'Subtotal'}
          </>
        }
        value={subtotalFormatted}
      />
      <DiscountTotalLine
        currencyCode={currency_code}
        discountAmount={discountAmount}
      />
      <AdjustmentTotalLine adjustmentAmount={adjustmentAmount} />

      {taxEntries.map((tax, index) => (
        <TotalLine
          key={index}
          title={tax.label}
          value={tax.taxAmountFormatted}
          borderStyle={TotalLineBorderStyle.None}
        />
      ))}

      <TotalLine
        title={`Total (${currency_code})`}
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
