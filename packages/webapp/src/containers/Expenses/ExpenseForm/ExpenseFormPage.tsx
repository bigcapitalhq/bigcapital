import React from 'react';
import { useParams } from 'react-router-dom';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseFormPageProvider } from './ExpenseFormPageProvider';

/**
 * Expense page form.
 */
export function ExpenseFormPage() {
  const { id } = useParams<{ id: string }>();
  const expenseId = parseInt(id, 10);

  return (
    <ExpenseFormPageProvider expenseId={expenseId}>
      <ExpenseForm />
    </ExpenseFormPageProvider>
  );
}
