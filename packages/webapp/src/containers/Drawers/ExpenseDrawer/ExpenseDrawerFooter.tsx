import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';
import {
  CommercialDocFooter,
  DetailsMenu,
  DetailItem,
  If,
  T,
  TotalLine,
  TotalLines,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';

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
      <CommercialDocFooter>
        <DetailsMenu direction={'horizantal'} minLabelSize={'160px'}>
          <If condition={!!expense?.description}>
            <DetailItem label={intl.get('description')} multiline>
              {expense?.description}
            </DetailItem>
          </If>
        </DetailsMenu>
      </CommercialDocFooter>
    </ExpenseDetailsFooterRoot>
  );
}

export const ExpenseDetailsFooterRoot = styled.div``;

export const ExpenseTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
