import React, { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import type { ProfitLossTableQuery } from '@bigcapital/sdk-ts';
import { useProfitLossSheet } from '@/hooks/query';

type UseProfitLossSheetResult = ReturnType<typeof useProfitLossSheet>;

type ProfitLossSheetContextValue = {
  profitLossSheet: UseProfitLossSheetResult['data'];
  isLoading: boolean;
  isFetching: boolean;
  sheetRefetch: UseProfitLossSheetResult['refetch'];
  httpQuery: Record<string, unknown>;
  query: Record<string, unknown>;
  pageQuery: ProfitLossTableQuery;
  setPageQuery: (values: Record<string, unknown>) => void;
};

type ProfitLossSheetProviderProps = {
  query: Record<string, unknown>;
  setQuery: (values: Record<string, unknown>) => void;
  children?: React.ReactNode;
};

const ProfitLossSheetContext = createContext<
  ProfitLossSheetContextValue | undefined
>(undefined);

/**
 * Profit/loss sheet provider.
 */
function ProfitLossSheetProvider({
  query,
  setQuery,
  ...props
}: ProfitLossSheetProviderProps) {
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(query) as Record<string, unknown>,
    [query],
  );

  const {
    data: profitLossSheet,
    isFetching,
    isLoading,
    refetch,
  } = useProfitLossSheet(httpQuery as ProfitLossTableQuery, {
    placeholderData: (previousData) => previousData,
  });

  const provider: ProfitLossSheetContextValue = {
    profitLossSheet,
    isLoading,
    isFetching,
    sheetRefetch: refetch,
    query: httpQuery,
    httpQuery,
    pageQuery: query as ProfitLossTableQuery,
    setPageQuery: setQuery,
  };

  return (
    <FinancialReportPage name={'profit-loss-sheet'}>
      <ProfitLossSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useProfitLossSheetContext = (): ProfitLossSheetContextValue => {
  const ctx = useContext(ProfitLossSheetContext);
  if (!ctx) {
    throw new Error(
      'useProfitLossSheetContext must be used within a ProfitLossSheetProvider',
    );
  }
  return ctx;
};

export { useProfitLossSheetContext, ProfitLossSheetProvider };
