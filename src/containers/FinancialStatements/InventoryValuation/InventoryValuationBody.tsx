// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import InventoryValuationTable from './InventoryValuationTable';
import { useInventoryValuationContext } from './InventoryValuationProvider';

import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Inventory valuation body.
 * @returns {JSX.Element}
 */
function InventoryValuationBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isLoading } = useInventoryValuationContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <InventoryValuationTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const InventoryValuationBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(InventoryValuationBodyJSX);
