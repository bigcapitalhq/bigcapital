import React from 'react';
import styles from './ExpenseForm.module.scss';
import { useExpenseSubtotalFormatted, useExpenseTotalFormatted } from './utils';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';

export function ExpenseFormFooterRight() {
  const totalFormatted = useExpenseTotalFormatted();
  const subtotalFormatted = useExpenseSubtotalFormatted();

  return (
    <TotalLines className={styles.totalLines}>
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
    </TotalLines>
  );
}
