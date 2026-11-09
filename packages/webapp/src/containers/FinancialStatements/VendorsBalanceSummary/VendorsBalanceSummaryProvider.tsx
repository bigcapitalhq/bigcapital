import { VendorBalanceTableQuery } from '@bigcapital/sdk-ts';
import React, { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useVendorsBalanceSummaryReport } from '@/hooks/query';

type UseVendorsBalanceSummaryResult = ReturnType<
  typeof useVendorsBalanceSummaryReport
>;

interface VendorsBalanceSummaryContextValue {
  VendorBalanceSummary: UseVendorsBalanceSummaryResult['data'];
  isVendorsBalanceLoading: boolean;
  isVendorsBalanceFetching: boolean;
  refetch: UseVendorsBalanceSummaryResult['refetch'];
  httpQuery: Record<string, unknown>;
}

interface VendorsBalanceSummaryProviderProps {
  filter: Record<string, unknown>;
}

const VendorsBalanceSummaryContext = createContext<
  VendorsBalanceSummaryContextValue | undefined
>(undefined);

/**
 * Vendors balance summary provider.
 */
function VendorsBalanceSummaryProvider({
  filter,
  ...props
}: VendorsBalanceSummaryProviderProps & { children?: React.ReactNode }) {
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(filter) as VendorBalanceTableQuery,
    [filter],
  );

  // Fetching vendors balance summary report based on the given query.
  const {
    data: VendorBalanceSummary,
    isLoading: isVendorsBalanceLoading,
    isFetching: isVendorsBalanceFetching,
    refetch,
  } = useVendorsBalanceSummaryReport(httpQuery, {
    placeholderData: (prev) => prev,
  });

  // Provider.
  const provider: VendorsBalanceSummaryContextValue = {
    VendorBalanceSummary,
    isVendorsBalanceLoading,
    isVendorsBalanceFetching,
    refetch,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'vendors-balance-summary'}>
      <VendorsBalanceSummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useVendorsBalanceSummaryContext =
  (): VendorsBalanceSummaryContextValue => {
    const ctx = useContext(VendorsBalanceSummaryContext);
    if (!ctx) {
      throw new Error(
        'useVendorsBalanceSummaryContext must be used within a VendorsBalanceSummaryProvider',
      );
    }
    return ctx;
  };

export { VendorsBalanceSummaryProvider, useVendorsBalanceSummaryContext };
