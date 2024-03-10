// @ts-nocheck
import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useJournalSheet } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const JournalSheetContext = createContext();

/**
 * Journal sheet provider.
 */
function JournalSheetProvider({ query, ...props }) {
  // Transforms the sheet query to request query.
  const httpQuery = React.useMemo(
    () => transformFilterFormToQuery(query),
    [query],
  );
  const {
    data: journalSheet,
    isFetching,
    isLoading,
    refetch,
  } = useJournalSheet(httpQuery, { keepPreviousData: true });

  const provider = {
    journalSheet,
    isLoading,
    isFetching,
    refetchSheet: refetch,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'journal-sheet'}>
      <JournalSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useJournalSheetContext = () => useContext(JournalSheetContext);

export { JournalSheetProvider, useJournalSheetContext };
