import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import { SalesTaxLiabilitySummaryTable } from './SalesTaxLiabilitySummaryTable';
import { FinancialSheetSkeleton } from '@/components';

/**
 * Sales tax liability summary body.
 */
export function SalesTaxLiabilitySummaryBody() {
  const { isLoading } = useSalesTaxLiabilitySummaryContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <SalesTaxLiabilitySummaryTable />
      )}
    </FinancialReportBody>
  );
}
