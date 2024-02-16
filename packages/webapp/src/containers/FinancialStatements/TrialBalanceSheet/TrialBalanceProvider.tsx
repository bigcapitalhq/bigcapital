// @ts-nocheck
import { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useTrialBalanceSheet } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const TrialBalanceSheetContext = createContext();

function TrialBalanceSheetProvider({ query, ...props }) {
  const httpQuery = useMemo(() => transformFilterFormToQuery(query), [query]);

  const {
    data: trialBalanceSheet,
    isFetching,
    isLoading,
    refetch,
  } = useTrialBalanceSheet({ ...httpQuery }, { keepPreviousData: true });

  const provider = {
    trialBalanceSheet,
    isLoading,
    isFetching,
    refetchSheet: refetch,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'trial-balance-sheet'}>
      <TrialBalanceSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useTrialBalanceSheetContext = () => useContext(TrialBalanceSheetContext);

export { TrialBalanceSheetProvider, useTrialBalanceSheetContext };
