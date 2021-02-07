import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useProfitLossSheet } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const ProfitLossSheetContext = createContext();

function ProfitLossSheetProvider({ query, ...props }) {
  const { data: profitLossSheet, isFetching, refetch } = useProfitLossSheet({
    ...transformFilterFormToQuery(query),
  });

  const provider = {
    profitLossSheet,
    isLoading: isFetching,
    sheetRefetch: refetch,
  };

  return (
    <DashboardInsider>
      <ProfitLossSheetContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useProfitLossSheetContext = () => useContext(ProfitLossSheetContext);

export { useProfitLossSheetContext, ProfitLossSheetProvider };
