import React from 'react';
import * as R from 'ramda';

import { APAgingSummaryTable } from './APAgingSummaryTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';

import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

interface APAgingSummaryBodyProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

function APAgingSummaryBodyJSX({ organizationName }: APAgingSummaryBodyProps) {
  const { isAPAgingLoading } = useAPAgingSummaryContext();

  return (
    <FinancialReportBody>
      {isAPAgingLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <APAgingSummaryTable organizationName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const APAgingSummaryBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization?.name,
  })),
)(APAgingSummaryBodyJSX);
