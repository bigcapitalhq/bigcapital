import React from 'react';
import { useExpense } from 'hooks/query';
import { DrawerLoading } from 'components';

const ExpenseDrawerDrawerContext = React.createContext();

/**
 * Expense drawer provider.
 */
function ExpenseDrawerProvider({ expenseId, ...props }) {
  // Fetch the expense details.
  const {
    data: expense,
    isLoading: isExpenseLoading,
    isFetching: isExpenseFetching,
  } = useExpense(expenseId, {
    enabled: !!expenseId,
  });

  // Provider.
  const provider = {
    expenseId,
    expense,

    isExpenseFetching,
    isExpenseLoading,
  };

  return (
    <DrawerLoading loading={isExpenseLoading}>
      <ExpenseDrawerDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}
const useExpenseDrawerContext = () =>
  React.useContext(ExpenseDrawerDrawerContext);

export { ExpenseDrawerProvider, useExpenseDrawerContext };
