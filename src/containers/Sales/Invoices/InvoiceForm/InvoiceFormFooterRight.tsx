import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';
import { useInvoiceTotals } from './utils';

export function InvoiceFormFooterRight() {
  // Calculate the total due amount of invoice entries.
  const {
    formattedSubtotal,
    formattedTotal,
    formattedDueTotal,
    formattedPaymentTotal,
  } = useInvoiceTotals();

  return (
    <InvoiceTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'invoice_form.label.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'invoice_form.label.total'} />}
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
