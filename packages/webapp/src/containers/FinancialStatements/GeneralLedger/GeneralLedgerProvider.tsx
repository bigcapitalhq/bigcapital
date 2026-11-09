import React, { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import type { GeneralLedgerTableQuery } from '@bigcapital/sdk-ts';
import { useGeneralLedgerSheet } from '@/hooks/query';

type UseGeneralLedgerSheetResult = ReturnType<typeof useGeneralLedgerSheet>;

type GeneralLedgerContextValue = {
  generalLedger: UseGeneralLedgerSheetResult['data'];
  isFetching: boolean;
  isLoading: boolean;
  sheetRefresh: UseGeneralLedgerSheetResult['refetch'];
  httpQuery: Record<string, unknown>;
};

type GeneralLedgerProviderProps = {
  query: Record<string, unknown>;
  children?: React.ReactNode;
};

const GeneralLedgerContext = createContext<
  GeneralLedgerContextValue | undefined
>(undefined);

/**
 * General ledger provider.
 */
function GeneralLedgerProvider({
  query,
  ...props
}: GeneralLedgerProviderProps) {
  // Transformes the report query to request query.
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(query) as Record<string, unknown>,
    [query],
  );
  const {
    data: generalLedger,
    isFetching,
    isLoading,
    refetch,
  } = useGeneralLedgerSheet(httpQuery as GeneralLedgerTableQuery, {
    placeholderData: (previousData) => previousData,
  });

  const provider: GeneralLedgerContextValue = {
    generalLedger,
    sheetRefresh: refetch,
    isFetching,
    isLoading,
    httpQuery,
  };
  return (
    <FinancialReportPage name={'general-ledger-sheet'}>
      <GeneralLedgerContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useGeneralLedgerContext = (): GeneralLedgerContextValue => {
  const ctx = useContext(GeneralLedgerContext);
  if (!ctx) {
    throw new Error(
      'useGeneralLedgerContext must be used within a GeneralLedgerProvider',
    );
  }
  return ctx;
};

export { GeneralLedgerProvider, useGeneralLedgerContext };
