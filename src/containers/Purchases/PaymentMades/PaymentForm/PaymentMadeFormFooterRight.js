import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';
import { usePaymentMadeTotals } from './utils';

export function PaymentMadeFormFooterRight() {
  const { formattedSubtotal, formattedTotal } = usePaymentMadeTotals();
  return (
    <PaymentMadeTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'estimate.details.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'estimate.details.total'} />}
        value={formattedTotal}
        // borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
    </PaymentMadeTotalLines>
  );
}

const PaymentMadeTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
