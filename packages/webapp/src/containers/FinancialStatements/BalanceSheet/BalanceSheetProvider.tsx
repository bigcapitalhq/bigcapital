// @ts-nocheck
import { createContext, useContext, useMemo } from 'react';

import FinancialReportPage from '../FinancialReportPage';
import { useBalanceSheet } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const BalanceSheetContext = createContext();

function BalanceSheetProvider({ filter, ...props }) {
  // Transformes the given filter to query.
  const httpQuery = useMemo(() => transformFilterFormToQuery(filter), [filter]);

  // Fetches the balance sheet report.
  const {
    data: balanceSheet,
    isFetching,
    isLoading,
    refetch,
  } = useBalanceSheet(httpQuery, { keepPreviousData: true });

  const provider = {
    balanceSheet,
    isFetching,
    isLoading,
    refetchBalanceSheet: refetch,
    httpQuery,
    filter,
  };
  return (
    <FinancialReportPage name={'balance-sheet'}>
      <BalanceSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useBalanceSheetContext = () => useContext(BalanceSheetContext);

export { BalanceSheetProvider, useBalanceSheetContext };
