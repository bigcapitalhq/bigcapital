import { keepPreviousData } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { BudgetsListResponse, GetBudgetsQuery } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import { useBudgets } from '@/hooks/query';

interface BudgetsListContextValue {
  budgets: BudgetsListResponse['data'] | undefined;
  pagination: BudgetsListResponse['pagination'] | undefined;
  isBudgetsLoading: boolean;
  isBudgetsFetching: boolean;
  isEmptyStatus: boolean;
}

interface BudgetsListProviderProps {
  query?: GetBudgetsQuery;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

const BudgetsListContext = createContext<BudgetsListContextValue | undefined>(
  undefined,
);

/**
 * Budgets list data provider.
 */
function BudgetsListProvider({
  query,
  tableStateChanged,
  ...props
}: BudgetsListProviderProps) {
  // Fetches the budgets list with pagination meta.
  const {
    data: budgetsData,
    isLoading: isBudgetsLoading,
    isFetching: isBudgetsFetching,
  } = useBudgets(query, { placeholderData: keepPreviousData });

  // Determines the datatable empty status.
  const isEmptyStatus =
    isEmpty(budgetsData?.data) && !isBudgetsLoading && !tableStateChanged;

  // Provider payload.
  const provider: BudgetsListContextValue = {
    budgets: budgetsData?.data,
    pagination: budgetsData?.pagination,
    isBudgetsLoading,
    isBudgetsFetching,
    isEmptyStatus,
  };

  return (
    <DashboardInsider name={'budgets-list'}>
      <BudgetsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useBudgetsListContext = (): BudgetsListContextValue => {
  const ctx = React.useContext(BudgetsListContext);
  if (!ctx) {
    throw new Error(
      'useBudgetsListContext must be used within a BudgetsListProvider',
    );
  }
  return ctx;
};

export { BudgetsListProvider, useBudgetsListContext };
