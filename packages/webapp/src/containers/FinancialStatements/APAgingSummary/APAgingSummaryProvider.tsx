import { PayableAgingTableQuery } from '@bigcapital/sdk-ts';
import { useMemo, createContext, useContext } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useAPAgingSummaryReport } from '@/hooks/query';

type UseAPAgingSummaryResult = ReturnType<typeof useAPAgingSummaryReport>;

type APAgingSummaryContextValue = {
  APAgingSummary: UseAPAgingSummaryResult['data'];
  isAPAgingLoading: boolean;
  isAPAgingFetching: boolean;
  refetch: UseAPAgingSummaryResult['refetch'];
  query: PayableAgingTableQuery;
  httpQuery: PayableAgingTableQuery;
};

type APAgingSummaryProviderProps = {
  filter: Record<string, unknown>;
  children?: React.ReactNode;
};

const APAgingSummaryContext = createContext<
  APAgingSummaryContextValue | undefined
>(undefined);

function APAgingSummaryProvider({
  filter,
  ...props
}: APAgingSummaryProviderProps) {
  // Transformers the filter from to the Url query.
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(filter) as PayableAgingTableQuery,
    [filter],
  );

  const {
    data: APAgingSummary,
    isLoading: isAPAgingLoading,
    isFetching: isAPAgingFetching,
    refetch,
  } = useAPAgingSummaryReport(httpQuery, { placeholderData: (prev) => prev });

  const provider: APAgingSummaryContextValue = {
    APAgingSummary,
    isAPAgingLoading,
    isAPAgingFetching,
    refetch,
    query: httpQuery,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'AP-Aging-Summary'}>
      <APAgingSummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useAPAgingSummaryContext = (): APAgingSummaryContextValue => {
  const ctx = useContext(APAgingSummaryContext);
  if (!ctx)
    throw new Error(
      'useAPAgingSummaryContext must be used within APAgingSummaryProvider',
    );
  return ctx;
};

export { APAgingSummaryProvider, useAPAgingSummaryContext };
