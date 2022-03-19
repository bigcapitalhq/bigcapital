import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';
import { useInvoiceTotal } from './utils';

export function InvoiceFormFooterRight() {
  // Calculate the total due amount of invoice entries.
  const totalInvoice = useInvoiceTotal();

  return (
    <InvoiceTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'invoice.details.subtotal'} />}
        value={'$5000.00'}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'invoice.details.total'} />}
        value={'$5000.00'}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={<T id={'invoice.details.payment_amount'} />}
        value={'$0.00'}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'invoice.details.due_amount'} />}
        value={'$5000.00'}
        textStyle={TotalLineTextStyle.Bold}
      />
    </InvoiceTotalLines>
  );
}

const InvoiceTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
