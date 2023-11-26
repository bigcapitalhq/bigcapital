// @ts-nocheck
import React, { useMemo, createContext, useContext } from 'react';

import FinancialReportPage from '../FinancialReportPage';
import { useAPAgingSummaryReport } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const APAgingSummaryContext = createContext();

/**
 * A/P aging summary provider.
 */
function APAgingSummaryProvider({ filter, ...props }) {
  // Transformers the filter from to the Url query.
  const query = useMemo(() => transformFilterFormToQuery(filter), [filter]);

  const {
    data: APAgingSummary,
    isLoading: isAPAgingLoading,
    isFetching: isAPAgingFetching,
    refetch,
  } = useAPAgingSummaryReport(query, { keepPreviousData: true });

  const provider = {
    APAgingSummary,

    isAPAgingLoading,
    isAPAgingFetching,
    refetch,
    query,
  };

  return (
    <FinancialReportPage name={'AP-Aging-Summary'}>
      <APAgingSummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useAPAgingSummaryContext = () => useContext(APAgingSummaryContext);

export { APAgingSummaryProvider, useAPAgingSummaryContext };
