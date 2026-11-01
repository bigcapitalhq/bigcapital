import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useProfitLossSheetContext } from './ProfitLossProvider';
import { ProfitLossSheetTable } from './ProfitLossSheetTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

function ProfitLossBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading, profitLossSheet } = useProfitLossSheetContext();

  // Shows the skeleton only on the initial load. Refetches (e.g. sorting)
  // keep the current report rendered while the request is in flight.
  const isInitialLoading = isLoading && !profitLossSheet;

  return (
    <FinancialReportBody>
      {isInitialLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <ProfitLossSheetTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const ProfitLossBody = ProfitLossBodyJSX;
