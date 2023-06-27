// @ts-nocheck
import React, { createContext, useContext } from 'react';

import FinancialReportPage from '../FinancialReportPage';
import { useBalanceSheet } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const BalanceSheetContext = createContext();

function BalanceSheetProvider({ filter, ...props }) {
  // Transforms the given filter to query.
  const query = React.useMemo(() => transformFilterFormToQuery(filter), [
    filter,
  ]);

  // Fetches the balance sheet report.
  const {
    data: balanceSheet,
    isFetching,
    isLoading,
    refetch,
  } = useBalanceSheet(query, { keepPreviousData: true });

  const provider = {
    balanceSheet,
    isFetching,
    isLoading,
    refetchBalanceSheet: refetch,

    query,
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
