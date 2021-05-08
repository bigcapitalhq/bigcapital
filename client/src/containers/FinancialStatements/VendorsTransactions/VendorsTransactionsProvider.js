import React, { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useVendorsTranscationsReport } from 'hooks/query';


const VendorsTransactionsContext = createContext();

/**
 * Vendors transcations provider.
 */
function VendorsTransactionsProvider({ filter, ...props }) {
  const {
    data: vendorsTransactions,
    isFetching: isVendorsTransactionFetching,
    isLoading: isVendorsTransactionsLoading,
    refetch,
  } = useVendorsTranscationsReport();

  const provider = {
    vendorsTransactions,
    isVendorsTransactionsLoading,
    isVendorsTransactionFetching,
    refetch,
    filter,
  };

  return (
    <FinancialReportPage name={'vendor-transactions'}>
      <VendorsTransactionsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useVendorsTranscationsContext = () =>
  useContext(VendorsTransactionsContext);

export { VendorsTransactionsProvider, useVendorsTranscationsContext };
