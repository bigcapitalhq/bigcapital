import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getRecurringInvoiceTotals } from './utils';
import type { RecurringInvoiceFormValues } from './utils';
import {
  T,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
  TotalLines,
} from '@/components';
import { Features } from '@/constants';
import { AdjustmentTotalLine } from '@/containers/Sales/Invoices/InvoiceForm/AdjustmentTotalLine';
import { DiscountTotalLine } from '@/containers/Sales/Invoices/InvoiceForm/DiscountTotalLine';
import { useFeatureCan } from '@/hooks/state';
import { TaxType } from '@/interfaces/TaxRates';
import { formattedAmount } from '@/utils';

/**
 * Recurring invoice form footer right section.
 */
export function RecurringInvoiceFormFooterRight() {
  const { values } = useFormikContext<RecurringInvoiceFormValues>();
  const { featureCan } = useFeatureCan();
  const isSalesTaxFeatureCan = featureCan(Features.SalesTax);

  const totals = getRecurringInvoiceTotals(values);

  return (
    <RecurringTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={
          isSalesTaxFeatureCan &&
          values.inclusiveExclusiveTax === TaxType.Inclusive
            ? 'Subtotal (Tax Inclusive)'
            : 'Subtotal'
        }
        value={formattedAmount(totals.subtotal, values.currencyCode)}
      />
      <DiscountTotalLine
        currencyCode={values.currencyCode}
        discountAmount={formattedAmount(totals.discount, values.currencyCode)}
      />
      <AdjustmentTotalLine
        adjustmentAmount={formattedAmount(
          totals.adjustment,
          values.currencyCode,
        )}
      />

      {isSalesTaxFeatureCan && (
        <TotalLine
          title={<T id={'tax'} />}
          value={formattedAmount(totals.taxAmount, values.currencyCode)}
          borderStyle={TotalLineBorderStyle.None}
        />
      )}
      <TotalLine
        title={`${intl.get('total')} (${values.currencyCode})`}
        value={formattedAmount(totals.total, values.currencyCode)}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
    </RecurringTotalLines>
  );
}

const RecurringTotalLines = styled(TotalLines)`
  --x-color-text: #555;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  width: 100%;
  color: var(--x-color-text);
`;
