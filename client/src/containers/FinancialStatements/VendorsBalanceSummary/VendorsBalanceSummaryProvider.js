import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useVendorsBalanceSummaryReport } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const VendorsBalanceSummaryContext = React.createContext();

/**
 * Vendors balance summary provider.
 */
function VendorsBalanceSummaryProvider({ filter, ...props }) {
  // const query = React.useMemo(() => transformFilterFormToQuery(filter), [
  //   filter,
  // ]);

  const {
    data: VendorBalanceSummary,
    isLoading: isVendorsBalanceLoading,
    isFetching: isVendorsBalanceFetching,
    refetch,
  } = useVendorsBalanceSummaryReport(filter, {
    keepPreviousData: true,
  });

  const provider = {
    VendorBalanceSummary,
    isVendorsBalanceLoading,
    isVendorsBalanceFetching,
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
