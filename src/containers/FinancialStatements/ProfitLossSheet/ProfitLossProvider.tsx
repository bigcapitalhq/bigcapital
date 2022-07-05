import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useProfitLossSheet } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const ProfitLossSheetContext = createContext();

/**
 * Profit/loss sheet provider.
 * @returns {React.JSX}
 */
function ProfitLossSheetProvider({ query, ...props }) {
  const {
    data: profitLossSheet,
    isFetching,
    isLoading,
    refetch,
  } = useProfitLossSheet(
    {
      ...transformFilterFormToQuery(query),
    },
    { keepPreviousData: true },
  );

  const provider = {
    profitLossSheet,
    isLoading,
    isFetching,
    sheetRefetch: refetch,
  };

  return (
    <FinancialReportPage name={'profit-loss-sheet'}>
      <ProfitLossSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useProfitLossSheetContext = () => useContext(ProfitLossSheetContext);

export { useProfitLossSheetContext, ProfitLossSheetProvider };
