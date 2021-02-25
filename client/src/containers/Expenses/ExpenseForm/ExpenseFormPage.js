import React from 'react';
import { useParams } from 'react-router-dom';

import 'style/pages/Expense/PageForm.scss';

import ExpenseForm from './ExpenseForm';
import { ExpenseFormPageProvider } from './ExpenseFormPageProvider';

/**
 * Expense page form.
 */
export default function ExpenseFormPage() {
  const { id } = useParams();

  return (
    <ExpenseFormPageProvider expenseId={id}>
      <ExpenseForm />
    </ExpenseFormPageProvider>
  );
}
 