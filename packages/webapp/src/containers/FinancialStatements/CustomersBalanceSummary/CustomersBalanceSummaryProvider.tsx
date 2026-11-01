import React, { createContext, useContext } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useCustomerBalanceSummaryReport } from '@/hooks/query';

type UseCustomerBalanceSummaryResult = ReturnType<
  typeof useCustomerBalanceSummaryReport
>;

type CustomersBalanceSummaryContextValue = {
  CustomerBalanceSummary: UseCustomerBalanceSummaryResult['data'];
  isCustomersBalanceFetching: boolean;
  isCustomersBalanceLoading: boolean;
  refetch: UseCustomerBalanceSummaryResult['refetch'];
  query: Record<string, unknown>;
  httpQuery: Record<string, unknown>;
};

type CustomersBalanceSummaryProviderProps = {
  filter: Record<string, unknown>;
  children?: React.ReactNode;
};

const CustomersBalanceSummaryContext = createContext<
  CustomersBalanceSummaryContextValue | undefined
>(undefined);

/**
 * Customers balance summary provider.
 */
function CustomersBalanceSummaryProvider({
  filter,
  ...props
}: CustomersBalanceSummaryProviderProps) {
  const query = React.useMemo(
    () => transformFilterFormToQuery(filter) as Record<string, unknown>,
    [filter],
  );

  const {
    data: CustomerBalanceSummary,
    isLoading: isCustomersBalanceLoading,
    isFetching: isCustomersBalanceFetching,
    refetch,
  } = useCustomerBalanceSummaryReport(query, {
    placeholderData: (prev) => prev,
  });

  const provider: CustomersBalanceSummaryContextValue = {
    CustomerBalanceSummary,
    isCustomersBalanceFetching,
    isCustomersBalanceLoading,
    refetch,
    query,
    httpQuery: query,
  };
  return (
    <FinancialReportPage name={'customers-balance-summary'}>
      <CustomersBalanceSummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useCustomersBalanceSummaryContext =
  (): CustomersBalanceSummaryContextValue => {
    const ctx = useContext(CustomersBalanceSummaryContext);
    if (!ctx) {
      throw new Error(
        'useCustomersBalanceSummaryContext must be used within a CustomersBalanceSummaryProvider',
      );
    }
    return ctx;
  };

export { CustomersBalanceSummaryProvider, useCustomersBalanceSummaryContext };
