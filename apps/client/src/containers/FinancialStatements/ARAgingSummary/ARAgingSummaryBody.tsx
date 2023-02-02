// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import ARAgingSummaryTable from './ARAgingSummaryTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components';
import { useARAgingSummaryContext } from './ARAgingSummaryProvider';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

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
