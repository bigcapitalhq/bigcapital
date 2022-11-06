// @ts-nocheck
import React from 'react';

import ProfitLossSheetTable from './ProfitLossSheetTable';
import { FinancialSheetSkeleton } from '@/components';
import { FinancialReportBody } from '../FinancialReportPage';
import { useProfitLossSheetContext } from './ProfitLossProvider';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { compose } from '@/utils';

/**
 * @returns {React.JSX}
 */
function ProfitLossBodyJSX({
  // #withPreferences
  organizationName,
}) {
  const { isLoading } = useProfitLossSheetContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <ProfitLossSheetTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const ProfitLossBody = compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(ProfitLossBodyJSX);
