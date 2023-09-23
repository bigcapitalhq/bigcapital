// @ts-nocheck
import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { transformFilterFormToQuery } from '../common';
import { useSalesTaxLiabilitySummary } from '@/hooks/query';

const SalesTaxLiabilitySummaryContext = createContext();

/**
 * Sales tax liability summary boot.
 * @returns {JSX.Element}
 */
function SalesTaxLiabilitySummaryBoot({ filter, ...props }) {
  // Transformes the given filter to query.
  const query = React.useMemo(
    () => transformFilterFormToQuery(filter),
    [filter],
  );
  // Fetches the sales tax liability summary report.
  const {
    data: salesTaxLiabilitySummary,
    isFetching,
    isLoading,
    refetch,
  } = useSalesTaxLiabilitySummary(query, { keepPreviousData: true });

  const provider = {
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

const useSalesTaxLiabilitySummaryContext = () =>
  useContext(SalesTaxLiabilitySummaryContext);

export { SalesTaxLiabilitySummaryBoot, useSalesTaxLiabilitySummaryContext };
