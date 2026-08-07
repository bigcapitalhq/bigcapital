import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useCustomers } from '@/hooks/query';

type UseCustomersResult = ReturnType<typeof useCustomers>;

type ARAgingSummaryGeneralContextValue = {
  customers: UseCustomersResult['data'] extends
    | { customers?: infer C }
    | undefined
    ? C
    : undefined;
  isCustomersLoading: boolean;
};

const ARAgingSummaryGeneralContext = createContext<
  ARAgingSummaryGeneralContextValue | undefined
>(undefined);

function ARAgingSummaryGeneralProvider({
  children,
  ...props
}: {
  children?: React.ReactNode;
}) {
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers();

  const provider: ARAgingSummaryGeneralContextValue = {
    customers: (customersData as any)?.customers,
    isCustomersLoading,
  };

  const loading = isCustomersLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <ARAgingSummaryGeneralContext.Provider value={provider} {...props}>
      {children}
    </ARAgingSummaryGeneralContext.Provider>
  );
}

const useARAgingSummaryGeneralContext =
  (): ARAgingSummaryGeneralContextValue => {
    const ctx = useContext(ARAgingSummaryGeneralContext);
    if (!ctx)
      throw new Error(
        'useARAgingSummaryGeneralContext must be used within ARAgingSummaryGeneralProvider',
      );
    return ctx;
  };

export { ARAgingSummaryGeneralProvider, useARAgingSummaryGeneralContext };
