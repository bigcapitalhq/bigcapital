import React from 'react';
import * as R from 'ramda';
import { flow } from 'fp-ts/function';
import { ProfitLossSheetTable } from './ProfitLossSheetTable';
import { FinancialSheetSkeleton } from '@/components';
import { FinancialReportBody } from '../FinancialReportPage';
import { useProfitLossSheetContext } from './ProfitLossProvider';
import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';

interface ProfitLossBodyProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

function ProfitLossBodyJSX({ organizationName }: ProfitLossBodyProps) {
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

export const ProfitLossBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(ProfitLossBodyJSX);
