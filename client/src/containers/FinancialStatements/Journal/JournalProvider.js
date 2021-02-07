import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useJournalSheet } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const JournalSheetContext = createContext();

/**
 * Journal sheet provider.
 */
function JournalSheetProvider({ query, ...props }) {
  const { data: journalSheet, isFetching, refetch } = useJournalSheet({
    ...transformFilterFormToQuery(query)
  });

  const provider = {
    journalSheet,
    isLoading: isFetching,
    refetchSheet: refetch
  };

  return (
    <DashboardInsider name={'balance-sheet'}>
      <JournalSheetContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useJournalSheetContext = () => useContext(JournalSheetContext);

export { JournalSheetProvider, useJournalSheetContext };
