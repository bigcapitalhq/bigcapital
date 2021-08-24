import React from 'react';
import { useExpense } from 'hooks/query';
import { DashboardInsider } from 'components';

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
    <DashboardInsider loading={isExpenseLoading}>
      <ExpenseDrawerDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const useExpenseDrawerContext = () =>
  React.useContext(ExpenseDrawerDrawerContext);

export { ExpenseDrawerProvider, useExpenseDrawerContext };
