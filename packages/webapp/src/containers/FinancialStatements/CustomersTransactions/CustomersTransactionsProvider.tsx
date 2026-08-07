import { TransactionsByCustomersTableQuery } from '@bigcapital/sdk-ts';
import { createContext, useContext, useMemo, ReactNode } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useCustomersTransactionsReport } from '@/hooks/query';

type UseCustomersTransactionsResult = ReturnType<
  typeof useCustomersTransactionsReport
>;

interface CustomersTransactionsContextValue {
  customersTransactions: UseCustomersTransactionsResult['data'];
  isCustomersTransactionsFetching: boolean;
  isCustomersTransactionsLoading: boolean;
  CustomersTransactionsRefetch: UseCustomersTransactionsResult['refetch'];
  filter: Record<string, unknown>;
  query: Record<string, unknown>;
  httpQuery: Record<string, unknown>;
}

interface CustomersTransactionsProviderProps {
  filter: Record<string, unknown>;
  children?: ReactNode;
}

const CustomersTransactionsContext = createContext<
  CustomersTransactionsContextValue | undefined
>(undefined);

/**
 * Customers transactions provider.
 */
function CustomersTransactionsProvider({
  filter,
  ...props
}: CustomersTransactionsProviderProps) {
  const query = useMemo(
    () =>
      transformFilterFormToQuery(filter) as TransactionsByCustomersTableQuery,
    [filter],
  );

  // Fetches the customers transactions.
  const {
    data: customersTransactions,
    isFetching: isCustomersTransactionsFetching,
    isLoading: isCustomersTransactionsLoading,
    refetch: CustomersTransactionsRefetch,
  } = useCustomersTransactionsReport(query, {
    placeholderData: (prev) => prev,
  });

  const provider: CustomersTransactionsContextValue = {
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

const useCustomersTransactionsContext =
  (): CustomersTransactionsContextValue => {
    const ctx = useContext(CustomersTransactionsContext);
    if (!ctx)
      throw new Error(
        'useCustomersTransactionsContext must be used within a CustomersTransactionsProvider',
      );
    return ctx;
  };

export { CustomersTransactionsProvider, useCustomersTransactionsContext };
