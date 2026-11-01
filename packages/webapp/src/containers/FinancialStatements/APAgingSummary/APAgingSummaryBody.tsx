import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { APAgingSummaryTable } from './APAgingSummaryTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCurrentOrganizationName } from '@/hooks/query';

function APAgingSummaryBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isAPAgingLoading } = useAPAgingSummaryContext();

  return (
    <FinancialReportBody>
      {isAPAgingLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <APAgingSummaryTable organizationName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const APAgingSummaryBody = APAgingSummaryBodyJSX;
