import React, { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useVendorsTransactionsReport, useVendors } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const VendorsTransactionsContext = createContext();

/**
 * Vendors transactions provider.
 */
function VendorsTransactionsProvider({ filter, ...props }) {
  const query = useMemo(() => transformFilterFormToQuery(filter), [filter]);

  // Fetch vendors transactions based on the given query.
  const {
    data: vendorsTransactions,
    isFetching: isVendorsTransactionFetching,
    isLoading: isVendorsTransactionsLoading,
    refetch,
  } = useVendorsTransactionsReport(query, { keepPreviousData: true });

  // Fetch vendors list based on the given query.
  const {
    data: { vendors },
    isLoading: isVendorsLoading,
    isFetching: isVendorsFetching,
  } = useVendors({ page_size: 100000 });

  const provider = {
    vendorsTransactions,
    isVendorsTransactionsLoading,
    isVendorsTransactionFetching,

    vendors,
    isVendorsLoading,
    
    isVendorsFetching,
    refetch,
    filter,
    query,
  };

  return (
    <FinancialReportPage name={'vendor-transactions'}>
      <VendorsTransactionsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useVendorsTransactionsContext = () =>
  useContext(VendorsTransactionsContext);

export { VendorsTransactionsProvider, useVendorsTransactionsContext };
