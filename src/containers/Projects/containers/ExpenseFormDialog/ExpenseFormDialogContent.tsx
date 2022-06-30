import React from 'react';
import { ExpenseFormProvider } from './ExpenseFormProvider';
import ExpenseForm from './ExpenseForm';

/**
 * Expense form dialog content.
 * @returns
 */
export default function ExpenseFormDialogContent({
  // #ownProps
  dialogName,
  expense,
}) {
  return (
    <ExpenseFormProvider dialogName={dialogName} expenseId={expense}>
      <ExpenseForm />
    </ExpenseFormProvider>
  );
}
