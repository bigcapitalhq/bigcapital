// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  TotalLineBorderStyle,
  TotalLineTextStyle,
  FormatNumber,
  T,
  TotalLines,
  TotalLine,
} from '@/components';
import { useBillDrawerContext } from './BillDrawerProvider';

/**
 * Bill read-only details table footer.
 */
export function BillDetailTableFooter() {
  const { bill } = useBillDrawerContext();

  return (
    <BillDetailsFooterRoot>
      <BillTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'bill.details.subtotal'} />}
          value={<FormatNumber value={bill.amount} />}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'bill.details.total'} />}
          value={bill.formatted_amount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
        <TotalLine
          title={<T id={'bill.details.payment_amount'} />}
          value={bill.formatted_payment_amount}
        />
        <TotalLine
          title={<T id={'bill.details.due_amount'} />}
          value={bill.formatted_due_amount}
        />
      </BillTotalLines>
    </BillDetailsFooterRoot>
  );
}

export const BillDetailsFooterRoot = styled.div``;

export const BillTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
