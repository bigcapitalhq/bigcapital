import { CustomersListResponse } from '@bigcapital/sdk-ts';
import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useCustomers } from '@/hooks/query';

type CustomersBalanceSummaryGeneralContextValue = {
  isCustomersLoading: boolean;
  isCustomersFetching: boolean;
  customers: CustomersListResponse['data'] | undefined;
};

type CustomersBalanceSummaryGeneralProviderProps = {
  children?: React.ReactNode;
};

const CustomersBalanceSummaryGeneralContext = createContext<
  CustomersBalanceSummaryGeneralContextValue | undefined
>(undefined);

function CustomersBalanceSummaryGeneralProvider({
  ...props
}: CustomersBalanceSummaryGeneralProviderProps) {
  const {
    data: customersData,
    isFetching: isCustomersFetching,
    isLoading: isCustomersLoading,
  } = useCustomers();

  const provider: CustomersBalanceSummaryGeneralContextValue = {
    isCustomersLoading,
    isCustomersFetching,
    customers: customersData?.data ?? [],
  };

  return isCustomersLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <CustomersBalanceSummaryGeneralContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useCustomersBalanceSummaryGeneralContext =
  (): CustomersBalanceSummaryGeneralContextValue => {
    const ctx = useContext(CustomersBalanceSummaryGeneralContext);
    if (!ctx) {
      throw new Error(
        'useCustomersBalanceSummaryGeneralContext must be used within CustomersBalanceSummaryGeneralProvider',
      );
    }
    return ctx;
  };

export {
  CustomersBalanceSummaryGeneralProvider,
  useCustomersBalanceSummaryGeneralContext,
};
