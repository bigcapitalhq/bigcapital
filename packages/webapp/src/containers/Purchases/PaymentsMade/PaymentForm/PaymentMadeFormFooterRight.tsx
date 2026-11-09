import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import {
  usePaymentMadeExcessAmount,
  usePaymentMadeTotals,
  type PaymentMadeFormValues,
} from './utils';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
  FormatNumber,
} from '@/components';

export function PaymentMadeFormFooterRight() {
  const { formattedSubtotal, formattedTotal } = usePaymentMadeTotals();
  const excessAmount = usePaymentMadeExcessAmount();
  const {
    values: { currencyCode },
  } = useFormikContext<PaymentMadeFormValues>();

  return (
    <PaymentMadeTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'payment_made_form.label.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'payment_made_form.label.total'} />}
        value={formattedTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={'Excess Amount'}
        value={
          <FormatNumber
            value={excessAmount}
            currency={currencyCode}
            noZero={false}
          />
        }
        textStyle={TotalLineTextStyle.Regular}
      />
    </PaymentMadeTotalLines>
  );
}

const PaymentMadeTotalLines = styled(TotalLines)`
  --x-color-text: #555;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  width: 100%;
  color: var(--x-color-text);
`;
