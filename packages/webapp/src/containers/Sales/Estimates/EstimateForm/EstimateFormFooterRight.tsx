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
  useEstimateAdjustmentFormatted,
  useEstimateAggregatedTaxRates,
  useEstimateDiscountFormatted,
  useEstimateSubtotalFormatted,
  useEstimateTotalFormatted,
} from './utils';
import { TaxType } from '@/interfaces/TaxRates';
import { AdjustmentTotalLine } from '../../Invoices/InvoiceForm/AdjustmentTotalLine';
import { DiscountTotalLine } from '../../Invoices/InvoiceForm/DiscountTotalLine';

export function EstimateFormFooterRight() {
  const {
    values: { inclusive_exclusive_tax, currency_code },
  } = useFormikContext();

  const taxEntries = useEstimateAggregatedTaxRates();
  const subtotalFormatted = useEstimateSubtotalFormatted();
  const totalFormatted = useEstimateTotalFormatted();
  const discountAmountFormatted = useEstimateDiscountFormatted();
  const adjustmentAmountFormatted = useEstimateAdjustmentFormatted();

  return (
    <EstimateTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
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
        discountAmount={discountAmountFormatted}
      />
      <AdjustmentTotalLine adjustmentAmount={adjustmentAmountFormatted} />

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
    </EstimateTotalLines>
  );
}

const EstimateTotalLines = styled(TotalLines)`
  --x-color-text: #555;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  width: 100%;
  color: var(--x-color-text);
`;
