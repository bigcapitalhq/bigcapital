import React from 'react';
import styled from 'styled-components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';
import {
  T,
  TotalLines,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { TotalLine } from '@/components';

/**
 * Footer details of expense readonly details.
 */
export function ExpenseDrawerFooter() {
  const { expense } = useExpenseDrawerContext();

  return (
    <ExpenseDetailsFooterRoot>
      <ExpenseTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'expense.details.subtotal'} />}
          value={expense?.formattedAmount}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'expense.details.total'} />}
          value={expense?.formattedAmount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </ExpenseTotalLines>
    </ExpenseDetailsFooterRoot>
  );
}

export const ExpenseDetailsFooterRoot = styled.div``;

export const ExpenseTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
