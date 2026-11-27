import React from 'react';
import { useParams } from 'react-router-dom';
import { BudgetForm } from './BudgetForm';
import { BudgetFormProvider } from './BudgetFormProvider';

/**
 * Budget form page.
 */
export function BudgetFormPage() {
  const { id } = useParams<{ id?: string }>();
  const budgetId = id ? parseInt(id, 10) : undefined;

  return (
    <BudgetFormProvider budgetId={budgetId}>
      <BudgetForm />
    </BudgetFormProvider>
  );
}
