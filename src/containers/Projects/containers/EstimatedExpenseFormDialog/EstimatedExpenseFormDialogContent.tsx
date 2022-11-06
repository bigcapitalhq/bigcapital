// @ts-nocheck
import React from 'react';
import { EstimatedExpenseFormProvider } from './EstimatedExpenseFormProvider';
import EstimatedExpenseForm from './EstimatedExpenseForm';

/**
 * Estimate expense form dialog.
 * @return
 */
export default function EstimatedExpenseFormDialogContent({
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
