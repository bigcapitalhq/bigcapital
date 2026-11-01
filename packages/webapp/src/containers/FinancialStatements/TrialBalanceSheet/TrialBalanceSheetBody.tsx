import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import { TrialBalanceSheetTable } from './TrialBalanceSheetTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Trial balance sheet body.
 * @returns {React.JSX}
 */
function TrialBalanceSheetBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading, trialBalanceSheet } = useTrialBalanceSheetContext();

  // Shows the skeleton only on the initial load. Refetches (e.g. sorting)
  // keep the current report rendered while the request is in flight.
  const isInitialLoading = isLoading && !trialBalanceSheet;

  return (
    <FinancialReportBody>
      {isInitialLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <TrialBalanceSheetTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const TrialBalanceSheetBody = TrialBalanceSheetBodyJSX;
