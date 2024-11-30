// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
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
import {
  useCreditNoteSubtotalFormatted,
  useCreditNoteTotalFormatted,
} from './utils';

export function CreditNoteFormFooterRight() {
  const subtotalFormatted = useCreditNoteSubtotalFormatted();
  const totalFormatted = useCreditNoteTotalFormatted();

  return (
    <CreditNoteTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'credit_note.label_subtotal'} />}
        value={subtotalFormatted}
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
        title={<T id={'credit_note.label_total'} />}
        value={totalFormatted}
        textStyle={TotalLineTextStyle.Bold}
      />
    </CreditNoteTotalLines>
  );
}

const CreditNoteTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
