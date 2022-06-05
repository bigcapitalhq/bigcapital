import React from 'react';
import * as R from 'ramda';

import { FinancialReportBody } from '../FinancialReportPage';
import APAgingSummaryTable from './APAgingSummaryTable';
import { FinancialSheetSkeleton } from '../../../components/FinancialSheet';

import withCurrentOrganization from '../../Organization/withCurrentOrganization';

import { useAPAgingSummaryContext } from './APAgingSummaryProvider';

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
