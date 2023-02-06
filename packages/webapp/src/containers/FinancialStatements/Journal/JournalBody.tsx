// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components';
import { JournalTable } from './JournalTable';
import { useJournalSheetContext } from './JournalProvider';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Journal report body.
 * @returns {JSX.Element}
 */
function JournalBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
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

export const JournalBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(JournalBodyJSX);
