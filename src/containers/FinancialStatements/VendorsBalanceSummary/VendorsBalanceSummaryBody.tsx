// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import VendorsBalanceSummaryTable from './VendorsBalanceSummaryTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { FinancialReportBody } from '../FinancialReportPage';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Vendor balance summary body.
 * @returns {JSX.Element}
 */
function VendorsBalanceSummaryBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isVendorsBalanceLoading } = useVendorsBalanceSummaryContext();

  return (
    <FinancialReportBody>
      {isVendorsBalanceLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <VendorsBalanceSummaryTable organizationName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const VendorBalanceSummaryBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(VendorsBalanceSummaryBodyJSX);
