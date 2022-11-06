// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import CustomersTransactionsTable from './CustomersTransactionsTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';

import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';

/**
 * Customers transactions body.
 */
function CustomersTransactionsBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isCustomersTransactionsLoading } = useCustomersTransactionsContext();

  return (
    <FinancialReportBody>
      {isCustomersTransactionsLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <CustomersTransactionsTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const CustomersTransactionsBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(CustomersTransactionsBodyJSX);
