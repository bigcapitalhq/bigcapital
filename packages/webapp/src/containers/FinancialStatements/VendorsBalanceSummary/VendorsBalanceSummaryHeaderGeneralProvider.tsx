import React, { createContext, useContext } from 'react';
import { VendorsListResponse } from '@bigcapital/sdk-ts';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useVendors } from '@/hooks/query';

interface VendorsBalanceSummaryGeneralPanelContextValue {
  vendors: VendorsListResponse['data'] | undefined;
  isVendorsFetching: boolean;
  isVendorsLoading: boolean;
}

const VendorsBalanceSummaryGeneralPanelContext = createContext<
  VendorsBalanceSummaryGeneralPanelContextValue | undefined
>(undefined);

/**
 * Vendors balance summary general panel provider.
 */
function VendorsBalanceSummaryGeneralPanelProvider({
  ...props
}: {
  children?: React.ReactNode;
}) {
  // Fetch vendors list with pagination meta.
  const {
    data: vendorsData,
    isLoading: isVendorsLoading,
    isFetching: isVendorsFetching,
  } = useVendors({ page_size: 1000000 });

  // Provider.
  const provider: VendorsBalanceSummaryGeneralPanelContextValue = {
    vendors: vendorsData?.data,
    isVendorsFetching,
    isVendorsLoading,
  };

  const loading = isVendorsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <VendorsBalanceSummaryGeneralPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useVendorsBalanceSummaryGeneralPanelContext =
  (): VendorsBalanceSummaryGeneralPanelContextValue => {
    const ctx = useContext(VendorsBalanceSummaryGeneralPanelContext);
    if (!ctx) {
      throw new Error(
        'useVendorsBalanceSummaryGeneralPanelContext must be used within a VendorsBalanceSummaryGeneralPanelProvider',
      );
    }
    return ctx;
  };

export {
  VendorsBalanceSummaryGeneralPanelProvider,
  useVendorsBalanceSummaryGeneralPanelContext,
};
