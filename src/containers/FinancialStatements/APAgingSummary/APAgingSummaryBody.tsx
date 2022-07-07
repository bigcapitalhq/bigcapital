import React from 'react';
import * as R from 'ramda';

import APAgingSummaryTable from './APAgingSummaryTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';


/**
 * AP aging summary body.
 * @returns {JSX.Element}
 */
function APAgingSummaryBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isLoading } = useAPAgingSummaryContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <APAgingSummaryTable organizationName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const APAgingSummaryBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization?.name,
  })),
)(APAgingSummaryBodyJSX);
