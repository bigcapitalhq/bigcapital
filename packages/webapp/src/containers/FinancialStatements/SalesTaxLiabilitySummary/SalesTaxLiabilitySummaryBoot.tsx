import {
  SalesTaxLiabilityPdfQuery,
  SalesTaxLiabilityTableQuery,
} from '@bigcapital/sdk-ts';
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useSalesTaxLiabilitySummary } from '@/hooks/query';

type UseSalesTaxLiabilitySummaryResult = ReturnType<
  typeof useSalesTaxLiabilitySummary
>;

interface SalesTaxLiabilitySummaryContextValue {
  salesTaxLiabilitySummary: UseSalesTaxLiabilitySummaryResult['data'];
  refetchSalesTaxLiabilitySummary: UseSalesTaxLiabilitySummaryResult['refetch'];
  isFetching: boolean;
  isLoading: boolean;
  query: SalesTaxLiabilityPdfQuery;
  filter: Record<string, unknown>;
}

interface SalesTaxLiabilitySummaryBootProps {
  filter: Record<string, unknown>;
  children?: ReactNode;
}

const SalesTaxLiabilitySummaryContext = createContext<
  SalesTaxLiabilitySummaryContextValue | undefined
>(undefined);

/**
 * Sales tax liability summary boot.
 */
function SalesTaxLiabilitySummaryBoot({
  filter,
  ...props
}: SalesTaxLiabilitySummaryBootProps) {
  // Transformes the given filter to query.
  const query = useMemo(
    () => transformFilterFormToQuery(filter) as SalesTaxLiabilityTableQuery,
    [filter],
  );

  // Fetches the sales tax liability summary report.
  const {
    data: salesTaxLiabilitySummary,
    isFetching,
    isLoading,
    refetch,
  } = useSalesTaxLiabilitySummary(query, { placeholderData: (prev) => prev });

  const provider: SalesTaxLiabilitySummaryContextValue = {
    salesTaxLiabilitySummary,
    refetchSalesTaxLiabilitySummary: refetch,
    isFetching,
    isLoading,
    query,
    filter,
  };

  return (
    <FinancialReportPage name={'sales-tax-liability-summary'}>
      <SalesTaxLiabilitySummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useSalesTaxLiabilitySummaryContext =
  (): SalesTaxLiabilitySummaryContextValue => {
    const ctx = useContext(SalesTaxLiabilitySummaryContext);
    if (!ctx)
      throw new Error(
        'useSalesTaxLiabilitySummaryContext must be used within a SalesTaxLiabilitySummaryBoot',
      );
    return ctx;
  };

export { SalesTaxLiabilitySummaryBoot, useSalesTaxLiabilitySummaryContext };
