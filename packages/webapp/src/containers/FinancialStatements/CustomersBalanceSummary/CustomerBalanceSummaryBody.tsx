// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import CustomersBalanceSummaryTable from './CustomersBalanceSummaryTable';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Customer balance summary body.
 * @returns {JSX.Element}
 */
function CustomerBalanceSummaryBodyJSX({
  // #withPreferences
  organizationName,
}) {
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

export const CustomerBalanceSummaryBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(CustomerBalanceSummaryBodyJSX);
