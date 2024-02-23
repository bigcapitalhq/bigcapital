// @ts-nocheck
import { useMemo, createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useARAgingSummaryReport } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const ARAgingSummaryContext = createContext();

/**
 * A/R aging summary provider.
 */
function ARAgingSummaryProvider({ filter, ...props }) {
  // Transformes the filter from to the url query.
  const httpQuery = useMemo(() => transformFilterFormToQuery(filter), [filter]);

  // A/R aging summary sheet context.
  const {
    data: ARAgingSummary,
    isLoading: isARAgingLoading,
    isFetching: isARAgingFetching,
    refetch,
  } = useARAgingSummaryReport(httpQuery, { keepPreviousData: true });

  const provider = {
    ARAgingSummary,
    isARAgingLoading,
    isARAgingFetching,
    refetch,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'AR-Aging-Summary'}>
      <ARAgingSummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useARAgingSummaryContext = () => useContext(ARAgingSummaryContext);

export { ARAgingSummaryProvider, useARAgingSummaryContext };
