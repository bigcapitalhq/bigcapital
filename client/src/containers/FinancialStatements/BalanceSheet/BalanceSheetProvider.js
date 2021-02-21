import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useBalanceSheet } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const BalanceSheetContext = createContext();

function BalanceSheetProvider({ filter, ...props }) {
  // Transformes the given filter to query.
  const query = React.useMemo(() => transformFilterFormToQuery(filter), [filter]);

  // Fetches the balance sheet report.
  const { data: balanceSheet, isFetching, refetch } = useBalanceSheet(query);

  const provider = {
    balanceSheet,
    isLoading: isFetching,
    refetchBalanceSheet: refetch,
    
    query,
    filter,
  };
  return (
    <DashboardInsider name={'balance-sheet'}>
      <BalanceSheetContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useBalanceSheetContext = () => useContext(BalanceSheetContext);

export { BalanceSheetProvider, useBalanceSheetContext };