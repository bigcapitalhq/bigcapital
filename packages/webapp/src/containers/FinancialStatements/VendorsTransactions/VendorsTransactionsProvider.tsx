import { TransactionsByVendorsTableQuery } from '@bigcapital/sdk-ts';
import React, { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useVendorsTransactionsReport } from '@/hooks/query';

type UseVendorsTransactionsResult = ReturnType<
  typeof useVendorsTransactionsReport
>;

interface VendorsTransactionsContextValue {
  vendorsTransactions: UseVendorsTransactionsResult['data'];
  isVendorsTransactionsLoading: boolean;
  isVendorsTransactionFetching: boolean;
  refetch: UseVendorsTransactionsResult['refetch'];
  filter: Record<string, unknown>;
  httpQuery: TransactionsByVendorsTableQuery;
}

interface VendorsTransactionsProviderProps {
  filter: Record<string, unknown>;
}

const VendorsTransactionsContext =
  createContext<VendorsTransactionsContextValue>(
    {} as VendorsTransactionsContextValue,
  );

/**
 * Vendors transactions provider.
 */
function VendorsTransactionsProvider({
  filter,
  ...props
}: VendorsTransactionsProviderProps & { children?: React.ReactNode }) {
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(filter),
    [filter],
  ) as TransactionsByVendorsTableQuery;

  // Fetch vendors transactions based on the given query.
  const {
    data: vendorsTransactions,
    isFetching: isVendorsTransactionFetching,
    isLoading: isVendorsTransactionsLoading,
    refetch,
  } = useVendorsTransactionsReport(httpQuery);

  const provider: VendorsTransactionsContextValue = {
    vendorsTransactions,
    isVendorsTransactionsLoading,
    isVendorsTransactionFetching,
    refetch,
    filter,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'vendor-transactions'}>
      <VendorsTransactionsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useVendorsTransactionsContext = (): VendorsTransactionsContextValue => {
  const ctx = useContext(VendorsTransactionsContext);
  if (!ctx) {
    throw new Error(
      'useVendorsTransactionsContext must be used within a VendorsTransactionsProvider',
    );
  }
  return ctx;
};

export { VendorsTransactionsProvider, useVendorsTransactionsContext };
