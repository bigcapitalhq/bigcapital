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
  const requestQuery = React.useMemo(
    () => transformFilterFormToQuery(query),
    [query],
  );

  const {
    data: journalSheet,
    isFetching,
    isLoading,
    refetch,
  } = useJournalSheet(requestQuery, { keepPreviousData: true });

  const provider = {
    journalSheet,
    isLoading,
    isFetching,
    refetchSheet: refetch,
    httpQuery: requestQuery
  };

  return (
    <FinancialReportPage name={'journal-sheet'}>
      <JournalSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useJournalSheetContext = () => useContext(JournalSheetContext);

export { JournalSheetProvider, useJournalSheetContext };
