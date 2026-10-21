import React from 'react';
import intl from 'react-intl-universal';
import styles from './ExpenseForm.module.scss';
import { ExpenseFormHeader as ExpenseFormHeaderFields } from './ExpenseFormHeaderFields';
import { useExpenseTotalFormatted } from './utils';
import { PageFormBigNumber } from '@/components';

// Expense form header.
export function ExpenseFormHeader() {
  const totalFormatted = useExpenseTotalFormatted();

  return (
    <div className={styles.header}>
      <ExpenseFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('expense_amount')}
        amount={totalFormatted as unknown as number}
      />
    </div>
  );
}
