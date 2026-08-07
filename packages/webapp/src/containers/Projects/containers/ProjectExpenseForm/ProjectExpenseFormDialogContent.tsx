// @ts-nocheck
import React from 'react';
import { ProjectExpenseForm } from './ProjectExpenseForm';
import { ProjectExpenseFormProvider } from './ProjectExpenseFormProvider';

/**
 * Project expense form dialog content.
 * @returns
 */
export function ProjectExpenseFormDialogContent({
  // #ownProps
  dialogName,
  expense,
}) {
  return (
    <ProjectExpenseFormProvider dialogName={dialogName} expenseId={expense}>
      <ProjectExpenseForm />
    </ProjectExpenseFormProvider>
  );
}
