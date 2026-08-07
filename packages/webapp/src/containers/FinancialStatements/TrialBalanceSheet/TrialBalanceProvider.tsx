import { TrialBalanceTableQuery } from '@bigcapital/sdk-ts';
import { createContext, useContext, useMemo, ReactNode } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useTrialBalanceSheet } from '@/hooks/query';

type UseTrialBalanceSheetResult = ReturnType<typeof useTrialBalanceSheet>;

type TrialBalanceSheetContextValue = {
  trialBalanceSheet: UseTrialBalanceSheetResult['data'];
  isFetching: boolean;
  isLoading: boolean;
  refetchSheet: UseTrialBalanceSheetResult['refetch'];
  httpQuery: TrialBalanceTableQuery;
};

interface TrialBalanceSheetProviderProps {
  query: TrialBalanceTableQuery;
  children?: ReactNode;
}

const TrialBalanceSheetContext = createContext<
  TrialBalanceSheetContextValue | undefined
>(undefined);

function TrialBalanceSheetProvider({
  query,
  ...props
}: TrialBalanceSheetProviderProps) {
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(query) as TrialBalanceTableQuery,
    [query],
  );

  const {
    data: trialBalanceSheet,
    isFetching,
    isLoading,
    refetch,
  } = useTrialBalanceSheet(
    { ...httpQuery },
    { placeholderData: (prev) => prev },
  );

  const provider: TrialBalanceSheetContextValue = {
    trialBalanceSheet,
    isLoading,
    isFetching,
    refetchSheet: refetch,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'trial-balance-sheet'}>
      <TrialBalanceSheetContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useTrialBalanceSheetContext = (): TrialBalanceSheetContextValue => {
  const ctx = useContext(TrialBalanceSheetContext);
  if (!ctx)
    throw new Error(
      'useTrialBalanceSheetContext must be used within a TrialBalanceSheetProvider',
    );
  return ctx;
};

export { TrialBalanceSheetProvider, useTrialBalanceSheetContext };
