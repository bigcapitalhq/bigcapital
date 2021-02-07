import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useBalanceSheet } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const BalanceSheetContext = createContext();

function BalanceSheetProvider({ query, ...props }) {
  const { data: balanceSheet, isFetching, refetch } = useBalanceSheet({
    ...transformFilterFormToQuery(query),
  });

  const provider = {
    balanceSheet,
    isLoading: isFetching,
    refetchBalanceSheet: refetch
  };
  return (
    <DashboardInsider name={'balance-sheet'}>
      <BalanceSheetContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useBalanceSheetContext = () => useContext(BalanceSheetContext);

export { BalanceSheetProvider, useBalanceSheetContext };