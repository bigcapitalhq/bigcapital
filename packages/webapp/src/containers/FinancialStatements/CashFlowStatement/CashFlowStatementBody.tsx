import React from 'react';
import * as R from 'ramda';

import { CashFlowStatementTable } from './CashFlowStatementTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';

import { useCashFlowStatementContext } from './CashFlowStatementProvider';
import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

interface CashFlowStatementBodyProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

function CashFlowStatementBodyJSX({
  organizationName,
}: CashFlowStatementBodyProps) {
  const { isCashFlowLoading } = useCashFlowStatementContext();

  return (
    <FinancialReportBody>
      {isCashFlowLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <CashFlowStatementTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const CashFlowStatementBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(CashFlowStatementBodyJSX);
