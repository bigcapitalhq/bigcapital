import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import { GeneralLedgerTable } from './GeneralLedgerTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * General ledger body JSX.
 */
function GeneralLedgerBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading } = useGeneralLedgerContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <GeneralLedgerTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const GeneralLedgerBody = GeneralLedgerBodyJSX;
