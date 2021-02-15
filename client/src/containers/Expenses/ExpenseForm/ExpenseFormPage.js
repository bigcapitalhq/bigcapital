import React from 'react';
import { useParams } from 'react-router-dom';

import ExpenseForm from './ExpenseForm';
import { ExpenseFormPageProvider } from './ExpenseFormPageProvider';

import 'style/pages/Expense/PageForm.scss';

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
 