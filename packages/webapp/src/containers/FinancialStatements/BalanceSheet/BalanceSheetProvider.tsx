import React, { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import type { BalanceSheetTableQuery } from '@bigcapital/sdk-ts';
import { useBalanceSheet } from '@/hooks/query';

type UseBalanceSheetResult = ReturnType<typeof useBalanceSheet>;

type BalanceSheetContextValue = {
  balanceSheet: UseBalanceSheetResult['data'];
  isFetching: boolean;
  isLoading: boolean;
  refetchBalanceSheet: UseBalanceSheetResult['refetch'];
  httpQuery: Record<string, unknown>;
  filter: Record<string, unknown>;
  pageQuery: BalanceSheetTableQuery;
  setPageQuery: (values: Record<string, unknown>) => void;
};

type BalanceSheetProviderProps = {
  filter: Record<string, unknown>;
  setQuery: (values: Record<string, unknown>) => void;
  children?: React.ReactNode;
};

const BalanceSheetContext = createContext<BalanceSheetContextValue | undefined>(
  undefined,
);

function BalanceSheetProvider({
  filter,
  setQuery,
  ...props
}: BalanceSheetProviderProps) {
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(filter) as Record<string, unknown>,
    [filter],
  );
  const {
    data: balanceSheet,
    isFetching,
    isLoading,
    refetch,
  } = useBalanceSheet(httpQuery as BalanceSheetTableQuery, {
    placeholderData: (previousData) => previousData,
  });

  const provider: BalanceSheetContextValue = {
    balanceSheet,
    isFetching,
    isLoading,
    refetchBalanceSheet: refetch,
    httpQuery,
    filter,
    pageQuery: filter as BalanceSheetTableQuery,
    setPageQuery: setQuery,
  };
  return (
    <FinancialReportPage name={'balance-sheet'}>
      <BalanceSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useBalanceSheetContext = (): BalanceSheetContextValue => {
  const ctx = useContext(BalanceSheetContext);
  if (!ctx) {
    throw new Error(
      'useBalanceSheetContext must be used within a BalanceSheetProvider',
    );
  }
  return ctx;
};

export { BalanceSheetProvider, useBalanceSheetContext };
