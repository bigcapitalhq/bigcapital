import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useTrialBalanceSheet } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const TrialBalanceSheetContext = createContext();

function TrialBalanceSheetProvider({ query, ...props }) {
  const { data: trialBalanceSheet, isFetching, refetch } = useTrialBalanceSheet(
    {
      ...transformFilterFormToQuery(query),
    },
  );

  const provider = {
    trialBalanceSheet,
    isLoading: isFetching,
    refetchSheet: refetch,
  };

  return (
    <DashboardInsider name={'trial-balance-sheet'}>
      <TrialBalanceSheetContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useTrialBalanceSheetContext = () => useContext(TrialBalanceSheetContext);

export { TrialBalanceSheetProvider, useTrialBalanceSheetContext };
