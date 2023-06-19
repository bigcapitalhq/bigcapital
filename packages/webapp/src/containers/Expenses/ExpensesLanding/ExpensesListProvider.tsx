// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components/Dashboard';
import { useExpenses, useResourceMeta, useResourceViews } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

const ExpensesListContext = createContext();

/**
 * Accounts chart data provider.
 */
function ExpensesListProvider({ query, tableStateChanged, ...props }) {
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

  // Determines the datatable empty status.
  const isEmptyStatus =
    isEmpty(expenses) && !isExpensesLoading && !tableStateChanged;

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
      loading={isViewsLoading || isResourceMetaLoading}
      name={'expenses'}
    >
      <ExpensesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useExpensesListContext = () => React.useContext(ExpensesListContext);

export { ExpensesListProvider, useExpensesListContext };
