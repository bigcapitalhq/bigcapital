import React from 'react';
import { useExpense } from 'hooks/query';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

const ExpenseDrawerDrawerContext = React.createContext();

/**
 * Expense drawer provider.
 */
function ExpenseDrawerProvider({ expenseId, ...props }) {
  
  // Fetch the expense details.
  const { data: expense, isLoading: isExpenseLoading } = useExpense(expenseId, {
    enabled: !!expenseId,
  });

  // provider.
  const provider = {
    expenseId,
    expense,
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
