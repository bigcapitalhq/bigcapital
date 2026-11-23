import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { BalanceSheetTable } from './BalanceSheetTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

function BalanceSheetBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading, balanceSheet } = useBalanceSheetContext();

  // Shows the skeleton only on the initial load. Refetches (e.g. sorting)
  // keep the current report rendered while the request is in flight.
  const isInitialLoading = isLoading && !balanceSheet;

  return (
    <FinancialReportBody>
      {isInitialLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <BalanceSheetTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const BalanceSheetBody = BalanceSheetBodyJSX;
