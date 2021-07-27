import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useVendorsBalanceSummaryReport, useVendors } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const VendorsBalanceSummaryContext = React.createContext();

/**
 * Vendors balance summary provider.
 */
function VendorsBalanceSummaryProvider({ filter, ...props }) {
  const query = React.useMemo(() => transformFilterFormToQuery(filter), [
    filter,
  ]);

  // Fetching vendors balance summary report based on the given query.
  const {
    data: VendorBalanceSummary,
    isLoading: isVendorsBalanceLoading,
    isFetching: isVendorsBalanceFetching,
    refetch,
  } = useVendorsBalanceSummaryReport(query, {
    keepPreviousData: true,
  });

  // Fetch vendors list with pagination meta.
  const {
    data: { vendors },
    isLoading: isVendorsLoading,
    isFetching: isVendorsFetching,
  } = useVendors({ page_size: 1000000 });

  // Provider.
  const provider = {
    VendorBalanceSummary,
    isVendorsBalanceLoading,
    isVendorsBalanceFetching,

    vendors,
    isVendorsFetching,
    isVendorsLoading,

    refetch,
  };

  return (
    <FinancialReportPage name={'vendors-balance-summary'}>
      <VendorsBalanceSummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useVendorsBalanceSummaryContext = () =>
  React.useContext(VendorsBalanceSummaryContext);
export { VendorsBalanceSummaryProvider, useVendorsBalanceSummaryContext };
