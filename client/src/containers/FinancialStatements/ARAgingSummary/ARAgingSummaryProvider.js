import React, { useMemo, createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useARAgingSummaryReport, useCustomers } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const ARAgingSummaryContext = createContext();

/**
 * A/R aging summary provider.
 */
function ARAgingSummaryProvider({ filter, ...props }) {
  // Transformes the filter from to the Url query.
  const query = useMemo(() => transformFilterFormToQuery(filter), [filter]);

  const {
    data: ARAgingSummary,
    isLoading: isARAgingLoading,
    isFetching: isARAgingFetching,
    refetch,
  } = useARAgingSummaryReport(query);

  // Retrieve the customers list.
  const {
    data: { customers },
    isFetching: isCustomersFetching,
  } = useCustomers();

  const provider = {
    ARAgingSummary,
    customers,

    isARAgingLoading,
    isARAgingFetching,
    isCustomersFetching,
    refetch,
  };

  return (
    <DashboardInsider name={'AR-Aging-Summary'}>
      <ARAgingSummaryContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useARAgingSummaryContext = () => useContext(ARAgingSummaryContext);

export { ARAgingSummaryProvider, useARAgingSummaryContext };
