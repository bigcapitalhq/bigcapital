// @ts-nocheck
import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useCustomerBalanceSummaryReport } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const CustomersBalanceSummaryContext = createContext();

/**
 * Customers balance summary provider.
 */
function CustomersBalanceSummaryProvider({ filter, ...props }) {
  const query = React.useMemo(
    () => transformFilterFormToQuery(filter),
    [filter],
  );

  // Fetches customers balance summary report based on the given report.
  const {
    data: CustomerBalanceSummary,
    isLoading: isCustomersBalanceLoading,
    isFetching: isCustomersBalanceFetching,
    refetch,
  } = useCustomerBalanceSummaryReport(query, {
    keepPreviousData: true,
  });

  const provider = {
    CustomerBalanceSummary,
    isCustomersBalanceFetching,
    isCustomersBalanceLoading,
    refetch,
    query,
    httpQuery: query
  };
  return (
    <FinancialReportPage name={'customers-balance-summary'}>
      <CustomersBalanceSummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useCustomersBalanceSummaryContext = () =>
  useContext(CustomersBalanceSummaryContext);

export { CustomersBalanceSummaryProvider, useCustomersBalanceSummaryContext };
