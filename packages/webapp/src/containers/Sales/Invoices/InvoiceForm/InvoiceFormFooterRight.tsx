// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

import { T, TotalLines, TotalLine, TotalLineBorderStyle, TotalLineTextStyle } from '@/components';
import { useInvoiceAggregatedTaxRates, useInvoiceTotals } from './utils';
import { TaxType } from '@/interfaces/TaxRates';

export function InvoiceFormFooterRight() {
  // Calculate the total due amount of invoice entries.
  const { formattedSubtotal, formattedTotal, formattedDueTotal, formattedPaymentTotal } = useInvoiceTotals();

  const {
    values: { inclusive_exclusive_tax, currency_code },
  } = useFormikContext();

  const taxEntries = useInvoiceAggregatedTaxRates();

  return (
    <InvoiceTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<>{inclusive_exclusive_tax === TaxType.Inclusive ? 'Subtotal (Tax Inclusive)' : 'Subtotal'}</>}
        value={formattedSubtotal}
      />
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
        value={formattedTotal}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={<T id={'invoice_form.label.payment_amount'} />}
        value={formattedPaymentTotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'invoice_form.label.due_amount'} />}
        value={formattedDueTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
    </InvoiceTotalLines>
  );
}

const InvoiceTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
