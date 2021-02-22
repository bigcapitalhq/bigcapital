import React, { useMemo, createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useAPAgingSummaryReport,useARAgingSummaryReport , useVendors } from 'hooks/query';
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
  } = useAPAgingSummaryReport(query);

  // Retrieve the vendors list.
  const {
    data: { vendors },
    isFetching: isVendorsLoading,
  } = useVendors();

  const provider = {
    APAgingSummary,
    vendors,

    isAPAgingLoading,
    isAPAgingFetching,
    isVendorsLoading,
    refetch,
  };

  return (
    <DashboardInsider name={'AP-Aging-Summary'}>
      <APAgingSummaryContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}


const useAPAgingSummaryContext = () => useContext(APAgingSummaryContext);


export { APAgingSummaryProvider, useAPAgingSummaryContext };
