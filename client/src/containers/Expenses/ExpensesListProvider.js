import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useExpenses, useResourceViews } from 'hooks/query';

const ExpensesListContext = createContext();

/**
 * Accounts chart data provider.
 */
function ExpensesListProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: expensesViews, isFetching: isViewsLoading } = useResourceViews(
    'expenses',
  );

  const {
    data: { expenses, pagination },
    isFetching: isExpensesLoading,
  } = useExpenses();

  // Provider payload.
  const provider = {
    expensesViews,
    expenses,
    pagination,

    isViewsLoading,
    isExpensesLoading
  };

  return (
    <DashboardInsider
      loading={isViewsLoading}
      name={'expenses'}
    >
      <ExpensesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useExpensesListContext = () =>
  React.useContext(ExpensesListContext);

export { ExpensesListProvider, useExpensesListContext };
