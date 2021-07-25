import React, { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useCustomersTransactionsReport, useCustomers } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const CustomersTransactionsContext = createContext();

/**
 * Customers transactions provider.
 */
function CustomersTransactionsProvider({ filter, ...props }) {
  const query = useMemo(() => transformFilterFormToQuery(filter), [
    filter,
  ]);

  // fetches the customers transactions.
  const {
    data: customersTransactions,
    isFetching: isCustomersTransactionsFetching,
    isLoading: isCustomersTransactionsLoading,
    refetch: CustomersTransactionsRefetch,
  } = useCustomersTransactionsReport(query, { keepPreviousData: true });

  // Fetches the customers list.
  const {
    data: { customers },
    isFetching: isCustomersFetching,
    isLoading: isCustomersLoading,
  } = useCustomers();

  const provider = {
    customersTransactions,
    isCustomersTransactionsFetching,
    isCustomersTransactionsLoading,
    CustomersTransactionsRefetch,

    customers,
    isCustomersLoading,
    isCustomersFetching,

    filter,
    query
  };

  return (
    <FinancialReportPage name={'customer-transactions'}>
      <CustomersTransactionsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}
const useCustomersTransactionsContext = () =>
  useContext(CustomersTransactionsContext);

export { CustomersTransactionsProvider, useCustomersTransactionsContext };
