import React from 'react';
import { GeneralLedgerTable } from './GeneralLedgerTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { FinancialReportBody } from '../FinancialReportPage';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

interface GeneralLedgerBodyProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

/**
 * General ledger body JSX.
 */
function GeneralLedgerBodyJSX({
  // #withCurrentOrganization
  organizationName,
}: GeneralLedgerBodyProps) {
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

export const GeneralLedgerBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(GeneralLedgerBodyJSX);
