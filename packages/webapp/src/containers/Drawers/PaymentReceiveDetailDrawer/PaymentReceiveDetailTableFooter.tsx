import React from 'react';
import styled from 'styled-components';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';
import {
  T,
  TotalLineTextStyle,
  TotalLineBorderStyle,
  TotalLine,
  TotalLines,
} from '@/components';

/**
 * Payment receive detail table footer.
 */
export function PaymentReceiveDetailTableFooter() {
  const { paymentReceive } = usePaymentReceiveDetailContext();

  if (!paymentReceive) {
    return null;
  }

  return (
    <PaymentReceiveDetailsFooterRoot>
      <PaymentReceiveTotalLines
        labelColWidth={'180px'}
        amountColWidth={'180px'}
      >
        <TotalLine
          title={<T id={'payment_receive.details.subtotal'} />}
          value={paymentReceive.subtotalFormatted}
        />
        <TotalLine
          title={<T id={'payment_receive.details.total'} />}
          value={paymentReceive.formattedAmount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </PaymentReceiveTotalLines>
    </PaymentReceiveDetailsFooterRoot>
  );
}

export const PaymentReceiveDetailsFooterRoot = styled.div``;

export const PaymentReceiveTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
