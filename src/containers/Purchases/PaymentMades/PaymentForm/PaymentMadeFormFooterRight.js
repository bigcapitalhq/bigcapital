import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';

export function PaymentMadeFormFooterRight() {
  return (
    <PaymentMadeTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'estimate.details.subtotal'} />}
        value={'$5000.00'}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'estimate.details.total'} />}
        value={'$5000.00'}
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