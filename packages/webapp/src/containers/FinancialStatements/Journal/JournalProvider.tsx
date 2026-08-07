import React, { createContext, useContext } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import type { JournalTableQuery } from '@bigcapital/sdk-ts';
import { useJournalSheet } from '@/hooks/query';

type UseJournalSheetResult = ReturnType<typeof useJournalSheet>;
type JournalSheetContextValue = {
  journalSheet: UseJournalSheetResult['data'];
  isLoading: boolean;
  isFetching: boolean;
  refetchSheet: UseJournalSheetResult['refetch'];
  httpQuery: Record<string, unknown>;
};

interface JournalSheetProviderProps {
  query: JournalTableQuery;
  children?: React.ReactNode;
}

const JournalSheetContext = createContext<JournalSheetContextValue>(
  {} as JournalSheetContextValue,
);

/**
 * Journal sheet provider.
 */
function JournalSheetProvider({ query, children }: JournalSheetProviderProps) {
  // Transforms the sheet query to request query.
  const httpQuery = React.useMemo(
    () => transformFilterFormToQuery(query) as JournalTableQuery,
    [query],
  );
  const {
    data: journalSheet,
    isFetching,
    isLoading,
    refetch,
  } = useJournalSheet(httpQuery as JournalTableQuery, {
    placeholderData: (prev) => prev,
  });

  const provider: JournalSheetContextValue = {
    journalSheet,
    isLoading,
    isFetching,
    refetchSheet: refetch,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'journal-sheet'}>
      <JournalSheetContext.Provider value={provider}>
        {children}
      </JournalSheetContext.Provider>
    </FinancialReportPage>
  );
}

const useJournalSheetContext = (): JournalSheetContextValue => {
  const ctx = useContext(JournalSheetContext);
  if (!ctx) {
    throw new Error(
      'useJournalSheetContext must be used within a JournalSheetProvider',
    );
  }
  return ctx;
};

export { JournalSheetProvider, useJournalSheetContext };
