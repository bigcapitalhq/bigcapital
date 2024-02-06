// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLineTextStyle,
  TotalLineBorderStyle,
  TotalLine,
  TotalLines,
} from '@/components';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

/**
 * Payment receive detail table footer.
 * @returns {React.JSX}
 */
export default function PaymentReceiveDetailTableFooter() {
  const { paymentReceive } = usePaymentReceiveDetailContext();

  return (
    <PaymentReceiveDetailsFooterRoot>
      <PaymentReceiveTotalLines
        labelColWidth={'180px'}
        amountColWidth={'180px'}
      >
        <TotalLine
          title={<T id={'payment_receive.details.subtotal'} />}
          value={paymentReceive.subtotal_formatted}
        />
        <TotalLine
          title={<T id={'payment_receive.details.total'} />}
          value={paymentReceive.formatted_amount}
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
