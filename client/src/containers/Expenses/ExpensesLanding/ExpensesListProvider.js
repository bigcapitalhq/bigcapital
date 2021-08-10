import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useExpenses, useResourceMeta, useResourceViews } from 'hooks/query';
import { isTableEmptyStatus, getFieldsFromResourceMeta } from 'utils';

const ExpensesListContext = createContext();

/**
 * Accounts chart data provider.
 */
function ExpensesListProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: expensesViews, isLoading: isViewsLoading } =
    useResourceViews('expenses');

  // Fetches the expenses with pagination meta.
  const {
    data: { expenses, pagination, filterMeta },
    isLoading: isExpensesLoading,
    isFetching: isExpensesFetching,
  } = useExpenses(query, { keepPreviousData: true });

  // Fetch the expenses resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('expenses');

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: expenses,
      pagination,
      filterMeta,
    }) && !isExpensesFetching;

  // Provider payload.
  const provider = {
    expensesViews,
    expenses,
    pagination,

    fields: getFieldsFromResourceMeta(resourceMeta.fields),
    resourceMeta,
    isResourceMetaLoading,
    isResourceMetaFetching,

    isViewsLoading,
    isExpensesLoading,
    isExpensesFetching,

    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isExpensesLoading || isResourceMetaLoading}
      name={'expenses'}
    >
      <ExpensesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useExpensesListContext = () => React.useContext(ExpensesListContext);

export { ExpensesListProvider, useExpensesListContext };
