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
import { useExpenseSubtotalFormatted, useExpenseTotalFormatted } from './utils';

export function ExpenseFormFooterRight() {
  const totalFormatted = useExpenseTotalFormatted();
  const subtotalFormatted = useExpenseSubtotalFormatted();

  return (
    <ExpensesTotalLines>
      <TotalLine
        title={<T id={'expense.label.subtotal'} />}
        value={subtotalFormatted}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'expense.label.total'} />}
        value={totalFormatted}
        textStyle={TotalLineTextStyle.Bold}
      />
    </ExpensesTotalLines>
  );
}

const ExpensesTotalLines = styled(TotalLines)`
  --x-color-text: #555555;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  width: 100%;
  color: var(--x-color-text);
`;
