import React, { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useCustomersTranscationsReport } from 'hooks/query';

const CustomersTranscationsContext = createContext();

/**
 * Customers transcations provider.
 */
function CustomersTranscationsProvider({ filter, ...props }) {
  // fetches the customers transcations.
  const {
    data: customersTransactions,
    isFetching: isCustomersTransactionsFetching,
    isLoading: isCustomersTransactionsLoading,
    refetch: CustomersTransactionsRefetch,
  } = useCustomersTranscationsReport(filter, { keepPreviousData: true });

  const provider = {
    customersTransactions,
    isCustomersTransactionsFetching,
    isCustomersTransactionsLoading,
    CustomersTransactionsRefetch,
    filter,
  };

  return (
    <FinancialReportPage name={'customer-transactions'}>
      <CustomersTranscationsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}
const useCustomersTranscationsContext = () =>
  useContext(CustomersTranscationsContext);

export { CustomersTranscationsProvider, useCustomersTranscationsContext };
