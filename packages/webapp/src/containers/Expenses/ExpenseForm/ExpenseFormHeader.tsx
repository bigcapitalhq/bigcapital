// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';

import ExpenseFormHeaderFields from './ExpenseFormHeaderFields';
import { PageForm, PageFormBigNumber } from '@/components';
import { useExpenseTotalFormatted } from './utils';

// Expense form header.
export default function ExpenseFormHeader() {
  const totalFormatted = useExpenseTotalFormatted();

  return (
    <PageForm.Header>
      <ExpenseFormHeaderFields />
      <PageFormBigNumber
        label={<T id={'expense_amount'} />}
        amount={totalFormatted}
      />
    </PageForm.Header>
  );
}
