import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';
import { InventoryItemDetailsTable } from './InventoryItemDetailsTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Inventory item details body.
 * @returns {JSX.Element}
 */
function InventoryItemDetailsBodyJSX() {
  const organizationName = useCurrentOrganizationName();
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

export const InventoryItemDetailsBody = InventoryItemDetailsBodyJSX;
