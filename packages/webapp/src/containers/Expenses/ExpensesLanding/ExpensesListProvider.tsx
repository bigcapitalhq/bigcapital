import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type {
  ExpensesListResponse,
  GetExpensesQuery,
  ResourceMetaResponse,
  ResourceViewResponse,
  SettingsGroup,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useExpenses,
  useResourceMeta,
  useResourceViews,
  useSettingsExpenses,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

type ExpensesListContextValue = {
  expenses: ExpensesListResponse['data'] | undefined;
  pagination: ExpensesListResponse['pagination'] | undefined;
  expensesViews: ResourceViewResponse | undefined;
  resourceMeta: ResourceMetaResponse | undefined;
  fields: any[];
  isExpensesLoading: boolean;
  isExpensesFetching: boolean;
  isResourceMetaLoading: boolean;
  isResourceMetaFetching: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;

  expenseSettings: SettingsGroup | undefined;
};

const ExpensesListContext = createContext<ExpensesListContextValue | undefined>(
  undefined,
);

type ExpensesListProviderProps = {
  query?: GetExpensesQuery;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
};

/**
 * Expenses list data provider.
 */
function ExpensesListProvider({
  query,
  tableStateChanged,
  ...props
}: ExpensesListProviderProps) {
  // Fetch expenses resource views and fields.
  const { data: expensesViews, isLoading: isViewsLoading } =
    useResourceViews('expenses');

  // Expense settings.
  const { data: expenseSettings } = useSettingsExpenses();

  // Fetches the expenses with pagination meta.
  const {
    data: expensesData,
    isLoading: isExpensesLoading,
    isFetching: isExpensesFetching,
  } = useExpenses(query, { keepPreviousData: true } as any);

  // Fetch the expenses resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('expenses');

  // Determines the datatable empty status.
  const isEmptyStatus =
    isEmpty(expensesData?.data) && !isExpensesLoading && !tableStateChanged;

  // Provider payload.
  const provider: ExpensesListContextValue = {
    expensesViews,
    expenses: expensesData?.data,
    pagination: expensesData?.pagination,

    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    resourceMeta,
    isResourceMetaLoading,
    isResourceMetaFetching,

    isViewsLoading,
    isExpensesLoading,
    isExpensesFetching,

    isEmptyStatus,

    expenseSettings,
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

const useExpensesListContext = (): ExpensesListContextValue => {
  const ctx = React.useContext(ExpensesListContext);
  if (!ctx) {
    throw new Error(
      'useExpensesListContext must be used within an ExpensesListProvider',
    );
  }
  return ctx;
};

export { ExpensesListProvider, useExpensesListContext };
