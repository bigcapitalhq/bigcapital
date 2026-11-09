import { TrialBalanceTableQuery } from '@bigcapital/sdk-ts';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from 'react';
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
  pageQuery: TrialBalanceTableQuery;
  setPageQuery: (values: Record<string, unknown>) => void;
};

interface TrialBalanceSheetProviderProps {
  query: TrialBalanceTableQuery;
  setQuery: (values: Record<string, unknown>) => void;
  children?: ReactNode;
}

const TrialBalanceSheetContext = createContext<
  TrialBalanceSheetContextValue | undefined
>(undefined);

function TrialBalanceSheetProvider({
  query,
  setQuery,
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

  // Keeps the last rendered report available while a new query (e.g. a
  // sorting change) is loading, so the table does not fall back to the
  // initial skeleton.
  const lastReportRef = useRef(trialBalanceSheet);
  useEffect(() => {
    if (trialBalanceSheet) {
      lastReportRef.current = trialBalanceSheet;
    }
  }, [trialBalanceSheet]);
  const report = trialBalanceSheet ?? lastReportRef.current;

  const provider: TrialBalanceSheetContextValue = {
    trialBalanceSheet: report,
    isLoading,
    isFetching,
    refetchSheet: refetch,
    httpQuery,
    pageQuery: query,
    setPageQuery: setQuery,
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
