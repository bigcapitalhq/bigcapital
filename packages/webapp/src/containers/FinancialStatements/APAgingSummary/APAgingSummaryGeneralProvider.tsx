import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useVendors } from '@/hooks/query';

type UseVendorsResult = ReturnType<typeof useVendors>;

type APAgingSummaryGeneralContextValue = {
  vendors: UseVendorsResult['data'] extends { vendors?: infer V } | undefined
    ? V
    : undefined;
  isVendorsLoading: boolean;
};

type APAgingSummaryGeneralProviderProps = {
  children?: React.ReactNode;
};

const APAgingSummaryGeneralContext = createContext<
  APAgingSummaryGeneralContextValue | undefined
>(undefined);

function APAgingSummaryGeneralProvider({
  children,
  ...props
}: APAgingSummaryGeneralProviderProps) {
  const { data: vendorsData, isFetching: isVendorsLoading } = useVendors();

  const provider: APAgingSummaryGeneralContextValue = {
    vendors: (vendorsData as any)?.vendors,
    isVendorsLoading,
  };

  const loading = isVendorsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <APAgingSummaryGeneralContext.Provider value={provider} {...props}>
      {children}
    </APAgingSummaryGeneralContext.Provider>
  );
}

const useAPAgingSummaryGeneralContext =
  (): APAgingSummaryGeneralContextValue => {
    const ctx = useContext(APAgingSummaryGeneralContext);
    if (!ctx)
      throw new Error(
        'useAPAgingSummaryGeneralContext must be used within APAgingSummaryGeneralProvider',
      );
    return ctx;
  };

export { APAgingSummaryGeneralProvider, useAPAgingSummaryGeneralContext };
