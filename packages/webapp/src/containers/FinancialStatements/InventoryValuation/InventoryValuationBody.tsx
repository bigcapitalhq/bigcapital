import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useInventoryValuationContext } from './InventoryValuationProvider';
import { InventoryValuationTable } from './InventoryValuationTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Inventory valuation body.
 * @returns {JSX.Element}
 */
function InventoryValuationBodyJSX() {
  const organizationName = useCurrentOrganizationName();
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

export const InventoryValuationBody = InventoryValuationBodyJSX;
