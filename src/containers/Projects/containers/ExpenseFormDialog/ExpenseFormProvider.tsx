//@ts-nocheck
import React from 'react';
import { DialogContent } from 'components';

const ExpenseFormContext = React.createContext();

/**
 * Expense form provider.
 * @returns
 */
function ExpenseFormProvider({
  //#OwnProps
  dialogName,
  expenseId,
  ...props
}) {
  // state provider.
  const provider = {
    dialogName,
  };

  return (
    <DialogContent>
      <ExpenseFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useExpenseFormContext = () => React.useContext(ExpenseFormContext);
export { ExpenseFormProvider, useExpenseFormContext };
