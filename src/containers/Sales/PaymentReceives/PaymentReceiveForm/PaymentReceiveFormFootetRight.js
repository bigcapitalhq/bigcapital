import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';
import { usePaymentReceiveTotals } from './utils';

export function PaymentReceiveFormFootetRight() {
  const { formattedSubtotal, formattedTotal } = usePaymentReceiveTotals();

  return (
    <PaymentReceiveTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
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
    </PaymentReceiveTotalLines>
  );
}

const PaymentReceiveTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
