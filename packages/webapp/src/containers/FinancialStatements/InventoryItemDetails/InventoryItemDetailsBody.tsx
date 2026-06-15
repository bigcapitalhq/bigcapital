import React from 'react';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';
import { InventoryItemDetailsTable } from './InventoryItemDetailsTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components';
import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

interface InventoryItemDetailsBodyProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

/**
 * Inventory item details body.
 * @returns {JSX.Element}
 */
function InventoryItemDetailsBodyJSX({
  organizationName,
}: InventoryItemDetailsBodyProps) {
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

export const InventoryItemDetailsBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(InventoryItemDetailsBodyJSX);
