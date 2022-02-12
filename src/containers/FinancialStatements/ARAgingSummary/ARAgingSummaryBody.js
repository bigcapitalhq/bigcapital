import React from 'react';
import * as R from 'ramda';

import ARAgingSummaryTable from './ARAgingSummaryTable';
import {
  FinancialReportBody,
  FinancialSheetSkeleton,
} from '../../../components';

import withCurrentOrganization from '../../../containers/Organization/withCurrentOrganization';
import { useARAgingSummaryContext } from './ARAgingSummaryProvider';

/**
 * A/R Aging summary body.
 * @returns {JSX.Element}
 */
function ARAgingSummaryBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
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

export const ARAgingSummaryBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(ARAgingSummaryBodyJSX);
