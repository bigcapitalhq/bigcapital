// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

/**
 * Payment made - Details panel - Footer.
 */
export default function PaymentMadeDetailTableFooter() {
  const { paymentMade } = usePaymentMadeDetailContext();

  return (
    <PaymentMadeFooterRoot>
      <PaymentMadeTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'payment_made.details.subtotal'} />}
          value={paymentMade.amount}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'payment_made.details.total'} />}
          value={paymentMade.formatted_amount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </PaymentMadeTotalLines>
    </PaymentMadeFooterRoot>
  );
}

export const PaymentMadeFooterRoot = styled.div``;

export const PaymentMadeTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
