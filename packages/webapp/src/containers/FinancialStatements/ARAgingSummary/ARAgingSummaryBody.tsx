import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { ARAgingSummaryTable } from './ARAgingSummaryTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

function ARAgingSummaryBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isARAgingLoading } = useARAgingSummaryContext();

  return (
    <FinancialReportBody>
      {isARAgingLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <ARAgingSummaryTable organizationName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const ARAgingSummaryBody = ARAgingSummaryBodyJSX;
