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
import { useEstimateTotals } from './utils';
import { Button } from '@blueprintjs/core';

export function EstimateFormFooterRight() {
  const { formattedSubtotal, formattedTotal } = useEstimateTotals();

  return (
    <EstimateTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'estimate_form.label.subtotal'} />}
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
        title={<T id={'estimate_form.label.total'} />}
        value={formattedTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
    </EstimateTotalLines>
  );
}

const EstimateTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
