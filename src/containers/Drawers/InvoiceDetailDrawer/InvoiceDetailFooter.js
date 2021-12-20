import React from 'react';
import styled from 'styled-components';

import { T, TotalLines, FormatNumber, TotalLine } from 'components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Invoice details footer.
 */
export function InvoiceDetailFooter() {
  const { invoice } = useInvoiceDetailDrawerContext();

  return (
    <InvoiceDetailsFooterRoot>
      <TotalLines>
        <SubTotalLine
          title={<T id={'invoice.details.subtotal'} />}
          value={<FormatNumber value={invoice.balance} />}
        />
        <InvoiceTotalLine
          title={<T id={'invoice.details.total'} />}
          value={invoice.formatted_amount}
        />
        <TotalLine
          title={<T id={'invoice.details.payment_amount'} />}
          value={invoice.formatted_payment_amount}
        />
        <DueAmountLine
          title={<T id={'invoice.details.due_amount'} />}
          value={invoice.formatted_due_amount}
        />
      </TotalLines>
    </InvoiceDetailsFooterRoot>
  );
}

const SubTotalLine = styled(TotalLine)`
  border-bottom: 1px solid #000;
`;

const InvoiceTotalLine = styled(TotalLine)`
  border-bottom: 3px double #000;
  font-weight: 600;
`;

const DueAmountLine = styled(TotalLine)`
  font-weight: 600;
`;

const InvoiceDetailsFooterRoot = styled.div`
  display: flex;

  .total_lines {
    margin-left: auto;
  }
  .total_lines_line {
    .amount,
    .title {
      width: 180px;
    }
    .amount {
      text-align: right;
    }
  }
`;
