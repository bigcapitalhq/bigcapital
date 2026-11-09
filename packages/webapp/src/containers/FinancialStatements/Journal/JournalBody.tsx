import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useJournalSheetContext } from './JournalProvider';
import { JournalTable } from './JournalTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Journal report body.
 * @returns {JSX.Element}
 */
function JournalBodyJSX() {
  const organizationName = useCurrentOrganizationName();
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

export const JournalBody = JournalBodyJSX;
