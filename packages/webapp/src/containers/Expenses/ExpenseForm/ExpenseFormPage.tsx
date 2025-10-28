// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import ExpenseForm from './ExpenseForm';
import { ExpenseFormPageProvider } from './ExpenseFormPageProvider';

/**
 * Expense page form.
 */
export default function ExpenseFormPage() {
  const { id } = useParams();
  const expenseId = parseInt(id, 10);

  return (
    <ExpenseFormPageProvider expenseId={expenseId}>
      <ExpenseForm />
    </ExpenseFormPageProvider>
  );
}
