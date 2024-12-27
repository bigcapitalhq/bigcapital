// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';

import ExpenseFormHeaderFields from './ExpenseFormHeaderFields';
import { PageFormBigNumber } from '@/components';
import { useExpenseTotalFormatted } from './utils';

// Expense form header.
export default function ExpenseFormHeader() {
  const totalFormatted = useExpenseTotalFormatted();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ExpenseFormHeaderFields />
      <PageFormBigNumber
        label={<T id={'expense_amount'} />}
        amount={totalFormatted}
      />
    </div>
  );
}
