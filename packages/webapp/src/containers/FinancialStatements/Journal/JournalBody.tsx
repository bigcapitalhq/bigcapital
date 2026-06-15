import React from 'react';
import * as R from 'ramda';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components';
import { JournalTable } from './JournalTable';
import { useJournalSheetContext } from './JournalProvider';
import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';
import type { WithCurrentOrganizationProps } from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

interface JournalBodyJSXProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

/**
 * Journal report body.
 * @returns {JSX.Element}
 */
function JournalBodyJSX({
  // #withCurrentOrganization
  organizationName,
}: JournalBodyJSXProps) {
  const { isLoading } = useJournalSheetContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <JournalTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const JournalBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(JournalBodyJSX);
