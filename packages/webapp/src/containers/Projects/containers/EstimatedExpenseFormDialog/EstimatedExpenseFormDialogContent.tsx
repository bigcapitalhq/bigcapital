// @ts-nocheck
import React from 'react';
import { EstimatedExpenseForm } from './EstimatedExpenseForm';
import { EstimatedExpenseFormProvider } from './EstimatedExpenseFormProvider';

/**
 * Estimate expense form dialog.
 * @return
 */
export function EstimatedExpenseFormDialogContent({
  //#ownProps
  dialogName,
  estimatedExpense,
}) {
  return (
    <EstimatedExpenseFormProvider
      dialogName={dialogName}
      estimatedExpenseId={estimatedExpense}
    >
      <EstimatedExpenseForm />
    </EstimatedExpenseFormProvider>
  );
}
