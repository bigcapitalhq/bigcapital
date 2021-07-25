import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useCustomerBalanceSummaryReport, useCustomers } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const CustomersBalanceSummaryContext = createContext();

/**
 * Customers balance summary provider.
 */
function CustomersBalanceSummaryProvider({ filter, ...props }) {
 
  const query = React.useMemo(() => transformFilterFormToQuery(filter), [
    filter,
  ]);

  // Fetches customers balance summary report based on the given report.
  const {
    data: CustomerBalanceSummary,
    isLoading: isCustomersBalanceLoading,
    isFetching: isCustomersBalanceFetching,
    refetch
  } = useCustomerBalanceSummaryReport(query, {
    keepPreviousData: true,
  });

  // Fetches the customers list.
  const {
    data: { customers },
    isFetching: isCustomersFetching,
    isLoading: isCustomersLoading,
  } = useCustomers();

  const provider = {
    CustomerBalanceSummary,
    isCustomersBalanceFetching,
    isCustomersBalanceLoading,

    isCustomersLoading,
    isCustomersFetching,
    customers,

    refetch,
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
