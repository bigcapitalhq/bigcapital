// @ts-nocheck
import { createContext, useContext, useMemo } from 'react';
import { useProfitLossSheet } from '@/hooks/query';
import FinancialReportPage from '../FinancialReportPage';
import { transformFilterFormToQuery } from '../common';

const ProfitLossSheetContext = createContext();

/**
 * Profit/loss sheet provider.
 * @returns {React.JSX}
 */
function ProfitLossSheetProvider({ query, ...props }) {
  const httpQuery = useMemo(() => transformFilterFormToQuery(query), [query]);

  const {
    data: profitLossSheet,
    isFetching,
    isLoading,
    refetch,
  } = useProfitLossSheet(httpQuery, { keepPreviousData: true });

  const provider = {
    profitLossSheet,
    isLoading,
    isFetching,
    sheetRefetch: refetch,
    query: httpQuery,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'profit-loss-sheet'}>
      <ProfitLossSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useProfitLossSheetContext = () => useContext(ProfitLossSheetContext);

export { useProfitLossSheetContext, ProfitLossSheetProvider };
