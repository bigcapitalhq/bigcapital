// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
  FormatNumber,
} from '@/components';
import {
  usePaymentReceiveTotals,
  usePaymentReceivedTotalExceededAmount,
} from './utils';

export function PaymentReceiveFormFootetRight() {
  const { formattedSubtotal, formattedTotal } = usePaymentReceiveTotals();
  const exceededAmount = usePaymentReceivedTotalExceededAmount();

  return (
    <PaymentReceiveTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'payment_receive_form.label.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'payment_receive_form.label.total'} />}
        value={formattedTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={'Exceeded Amount'}
        value={<FormatNumber value={exceededAmount} />}
        textStyle={TotalLineTextStyle.Regular}
      />
    </PaymentReceiveTotalLines>
  );
}

const PaymentReceiveTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
