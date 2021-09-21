import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useJournalSheet } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const JournalSheetContext = createContext();

/**
 * Journal sheet provider.
 */
function JournalSheetProvider({ query, ...props }) {
  const {
    data: journalSheet,
    isFetching,
    isLoading,
    refetch,
  } = useJournalSheet(
    { ...transformFilterFormToQuery(query) },
    { keepPreviousData: true },
  );

  const provider = {
    journalSheet,
    isLoading,
    isFetching,
    refetchSheet: refetch,
  };

  return (
    <FinancialReportPage name={'journal-sheet'}>
      <JournalSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useJournalSheetContext = () => useContext(JournalSheetContext);

export { JournalSheetProvider, useJournalSheetContext };
