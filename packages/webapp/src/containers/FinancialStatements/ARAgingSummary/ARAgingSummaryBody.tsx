import React from 'react';
import * as R from 'ramda';

import { ARAgingSummaryTable } from './ARAgingSummaryTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components';
import { useARAgingSummaryContext } from './ARAgingSummaryProvider';

import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

interface ARAgingSummaryBodyProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

function ARAgingSummaryBodyJSX({ organizationName }: ARAgingSummaryBodyProps) {
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

export const ARAgingSummaryBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization?.name,
  })),
)(ARAgingSummaryBodyJSX);
