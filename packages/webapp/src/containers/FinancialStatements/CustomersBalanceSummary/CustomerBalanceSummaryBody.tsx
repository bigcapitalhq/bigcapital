import React from 'react';
import * as R from 'ramda';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import { CustomersBalanceSummaryTable } from './CustomersBalanceSummaryTable';
import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

interface CustomerBalanceSummaryBodyProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

function CustomerBalanceSummaryBodyJSX({
  organizationName,
}: CustomerBalanceSummaryBodyProps) {
  const { isCustomersBalanceLoading } = useCustomersBalanceSummaryContext();

  return (
    <FinancialReportBody>
      {isCustomersBalanceLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <CustomersBalanceSummaryTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const CustomerBalanceSummaryBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(CustomerBalanceSummaryBodyJSX);
