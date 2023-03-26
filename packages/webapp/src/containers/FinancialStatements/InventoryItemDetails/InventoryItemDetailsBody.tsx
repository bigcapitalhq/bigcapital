// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';
import { InventoryItemDetailsTable } from './InventoryItemDetailsTable';

import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Inventory item details body.
 * @returns {JSX.Element}
 */
function InventoryItemDetailsBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isInventoryItemDetailsLoading } = useInventoryItemDetailsContext();

  return (
    <FinancialReportBody>
      {isInventoryItemDetailsLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <InventoryItemDetailsTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const InventoryItemDetailsBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(InventoryItemDetailsBodyJSX);
