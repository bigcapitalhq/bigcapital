import { VendorsListResponse } from '@bigcapital/sdk-ts';
import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useVendors } from '@/hooks/query';

interface VendorsTransactionsGeneralPanelContextValue {
  vendors: VendorsListResponse['data'] | undefined;
  isVendorsLoading: boolean;
  isVendorsFetching: boolean;
}

const VendorsTransactionsGeneralPanelContext = createContext<
  VendorsTransactionsGeneralPanelContextValue | undefined
>(undefined);

/**
 * Vendors transactions general panel provider.
 */
function VendorsTransactionsGeneralPanelProvider({
  ...props
}: {
  children?: React.ReactNode;
}) {
  // Fetch vendors list based on the given query.
  const {
    data: vendorsData,
    isLoading: isVendorsLoading,
    isFetching: isVendorsFetching,
  } = useVendors({ page_size: 100000 });

  const provider: VendorsTransactionsGeneralPanelContextValue = {
    vendors: vendorsData?.data,
    isVendorsLoading,
    isVendorsFetching,
  };
  const loading = isVendorsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <VendorsTransactionsGeneralPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useVendorsTransactionsGeneralPanelContext =
  (): VendorsTransactionsGeneralPanelContextValue => {
    const ctx = useContext(VendorsTransactionsGeneralPanelContext);
    if (!ctx) {
      throw new Error(
        'useVendorsTransactionsGeneralPanelContext must be used within a VendorsTransactionsGeneralPanelProvider',
      );
    }
    return ctx;
  };

export {
  VendorsTransactionsGeneralPanelProvider,
  useVendorsTransactionsGeneralPanelContext,
};
