import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';
import { useBillTotals } from './utils';

export function BillFormFooterRight() {
  const {
    formattedSubtotal,
    formattedTotal,
    formattedDueTotal,
    formattedPaymentTotal,
  } = useBillTotals();

  return (
    <BillTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'bill.details.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'bill.details.total'} />}
        value={formattedTotal}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={<T id={'bill.details.payment_amount'} />}
        value={formattedPaymentTotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'bill.details.due_amount'} />}
        value={formattedDueTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
    </BillTotalLines>
  );
}

const BillTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
