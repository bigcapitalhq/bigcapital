// @ts-nocheck
import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useTrialBalanceSheet } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const TrialBalanceSheetContext = createContext();

function TrialBalanceSheetProvider({ query, ...props }) {
  const {
    data: trialBalanceSheet,
    isFetching,
    isLoading,
    refetch,
  } = useTrialBalanceSheet(
    {
      ...transformFilterFormToQuery(query),
    },
    {
      keepPreviousData: true,
    },
  );

  const provider = {
    trialBalanceSheet,
    isLoading,
    isFetching,
    refetchSheet: refetch,
  };

  return (
    <FinancialReportPage name={'trial-balance-sheet'}>
      <TrialBalanceSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useTrialBalanceSheetContext = () => useContext(TrialBalanceSheetContext);

export { TrialBalanceSheetProvider, useTrialBalanceSheetContext };
