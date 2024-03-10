// @ts-nocheck
import { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useCustomersTransactionsReport } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const CustomersTransactionsContext = createContext();

/**
 * Customers transactions provider.
 */
function CustomersTransactionsProvider({ filter, ...props }) {
  const query = useMemo(() => transformFilterFormToQuery(filter), [filter]);

  // Fetches the customers transactions.
  const {
    data: customersTransactions,
    isFetching: isCustomersTransactionsFetching,
    isLoading: isCustomersTransactionsLoading,
    refetch: CustomersTransactionsRefetch,
  } = useCustomersTransactionsReport(query, { keepPreviousData: true });

  const provider = {
    customersTransactions,
    isCustomersTransactionsFetching,
    isCustomersTransactionsLoading,
    CustomersTransactionsRefetch,

    filter,
    query,
    httpQuery: query,
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
