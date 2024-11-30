// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
  FInputGroup,
  FFormGroup,
  FSelect,
} from '@/components';
import { useReceiptTotals } from './utils';
import { Button } from '@blueprintjs/core';

export function ReceiptFormFooterRight() {
  const {
    formattedSubtotal,
    formattedTotal,
    formattedDueTotal,
    formattedPaymentTotal,
  } = useReceiptTotals();

  return (
    <ReceiptTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'receipt_form.label.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <FFormGroup name={'discount'} label={'Discount'} inline>
        <FInputGroup
          name={'discount'}
          rightElement={
            <FSelect
              name={'discount_type'}
              items={[
                { text: 'USD', value: 'amount' },
                { text: '%', value: 'percentage' },
              ]}
              input={({ text }) => (
                <Button small minimal>
                  {text}
                </Button>
              )}
              filterable={false}
            />
          }
        />
      </FFormGroup>

      <FFormGroup name={'adjustment'} label={'Adjustment'} inline>
        <FInputGroup name={'adjustment'} />
      </FFormGroup>

      <TotalLine
        title={<T id={'receipt_form.label.total'} />}
        value={formattedTotal}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={<T id={'receipt_form.label.payment_amount'} />}
        value={formattedPaymentTotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'receipt_form.label.due_amount'} />}
        value={formattedDueTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
    </ReceiptTotalLines>
  );
}

const ReceiptTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
