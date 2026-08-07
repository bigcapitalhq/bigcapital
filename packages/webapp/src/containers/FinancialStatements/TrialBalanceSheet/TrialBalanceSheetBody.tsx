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
  const { isLoading } = useTrialBalanceSheetContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <TrialBalanceSheetTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const TrialBalanceSheetBody = TrialBalanceSheetBodyJSX;
