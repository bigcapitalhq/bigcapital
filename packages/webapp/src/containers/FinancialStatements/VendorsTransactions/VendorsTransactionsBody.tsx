// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';
import VendorsTransactionsTable from './VendorsTransactionsTable';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Vendors transactions body.
 * @returns {JSX.Element}
 */
function VendorsTransactionsBodyJSX({
  // #withPreferences
  organizationName,
}) {
  const { isVendorsTransactionsLoading } = useVendorsTransactionsContext();

  return (
    <FinancialReportBody>
      {isVendorsTransactionsLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <VendorsTransactionsTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const VendorsTransactionsBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(VendorsTransactionsBodyJSX);
