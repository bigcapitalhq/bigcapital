import React, { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useCustomersTranscationsReport } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const CustomersTranscationsContext = createContext();

/**
 * Customers transcations provider.
 */
function CustomersTranscationsProvider({ filter, ...props }) {
  const query = useMemo(() => transformFilterFormToQuery(filter), [
    filter,
  ]);

  // fetches the customers transcations.
  const {
    data: customersTransactions,
    isFetching: isCustomersTransactionsFetching,
    isLoading: isCustomersTransactionsLoading,
    refetch: CustomersTransactionsRefetch,
  } = useCustomersTranscationsReport(query, { keepPreviousData: true });

  const provider = {
    customersTransactions,
    isCustomersTransactionsFetching,
    isCustomersTransactionsLoading,
    CustomersTransactionsRefetch,
    filter,
    query
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
