import React from 'react';
import intl from 'react-intl-universal';
import { ExpenseFormHeader as ExpenseFormHeaderFields } from './ExpenseFormHeaderFields';
import { useExpenseTotalFormatted } from './utils';
import { PageForm, PageFormBigNumber } from '@/components';

// Expense form header.
export function ExpenseFormHeader() {
  const totalFormatted = useExpenseTotalFormatted();

  return (
    <PageForm.Header>
      <ExpenseFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('expense_amount')}
        amount={totalFormatted as unknown as number}
      />
    </PageForm.Header>
  );
}
