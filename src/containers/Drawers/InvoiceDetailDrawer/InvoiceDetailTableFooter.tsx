import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  FormatNumber,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Invoice details footer.
 */
export function InvoiceDetailTableFooter() {
  const { invoice } = useInvoiceDetailDrawerContext();

  return (
    <InvoiceDetailsFooterRoot>
      <InvoiceTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'invoice.details.subtotal'} />}
          value={<FormatNumber value={invoice.balance} />}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'invoice.details.total'} />}
          value={invoice.formatted_amount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
        <TotalLine
          title={<T id={'invoice.details.payment_amount'} />}
          value={invoice.formatted_payment_amount}
        />
        <TotalLine
          title={<T id={'invoice.details.due_amount'} />}
          value={invoice.formatted_due_amount}
          textStyle={TotalLineTextStyle.Bold}
        />
      </InvoiceTotalLines>
    </InvoiceDetailsFooterRoot>
  );
}

const InvoiceDetailsFooterRoot = styled.div``;

const InvoiceTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
