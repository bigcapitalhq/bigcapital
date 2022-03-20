import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';
import { useExpensesTotals } from './utils';

export function ExpenseFormFooterRight() {
  const { formattedSubtotal, formattedTotal } = useExpensesTotals();

  return (
    <ExpensesTotalLines>
      <TotalLine
        title={<T id={'manual_journal.details.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'manual_journal.details.total'} />}
        value={formattedTotal}
        // borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
    </ExpensesTotalLines>
  );
}

const ExpensesTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
