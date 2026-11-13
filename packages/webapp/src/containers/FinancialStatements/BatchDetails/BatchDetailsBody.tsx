import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useBatchDetailsContext } from './BatchDetailsProvider';
import { BatchDetailsTable } from './BatchDetailsTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Batch details report body.
 */
export function BatchDetailsBody() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading } = useBatchDetailsContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <BatchDetailsTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}
