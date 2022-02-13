import React from 'react';
import * as R from 'ramda';

import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';
import VendorsBalanceSummaryTable from './VendorsBalanceSummaryTable';
import { FinancialReportBody } from '../FinancialReportPage';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { FinancialSheetSkeleton } from '../../../components/FinancialSheet';

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
