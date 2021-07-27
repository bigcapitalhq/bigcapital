import React from 'react';
import ExpenseDrawerActionBar from './ExpenseDrawerActionBar';
import ExpenseDrawerHeader from './ExpenseDrawerHeader';
import ExpenseDrawerTable from './ExpenseDrawerTable';
import ExpenseDrawerFooter from './ExpenseDrawerFooter';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

/**
 * Expense view details.
 */
export default function ExpenseDrawerDetails() {
  const { expense } = useExpenseDrawerContext();
  return (
    <div className={'expense-drawer'}>
      <ExpenseDrawerActionBar expense={expense} />
      <div className="expense-drawer__content">
        <ExpenseDrawerHeader expense={expense} />
        <ExpenseDrawerTable expense={expense} />
        <ExpenseDrawerFooter expense={expense} />
      </div>
    </div>
  );
}
