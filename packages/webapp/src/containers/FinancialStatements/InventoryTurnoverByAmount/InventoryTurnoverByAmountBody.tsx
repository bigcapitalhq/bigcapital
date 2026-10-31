import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { InventoryTurnoverByAmountAlerts } from './components';
import { useInventoryTurnoverByAmountContext } from './InventoryTurnoverByAmountProvider';
import { InventoryTurnoverByAmountTable } from './InventoryTurnoverByAmountTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Inventory turnover by amount body.
 */
function InventoryTurnoverByAmountBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading } = useInventoryTurnoverByAmountContext();

  return (
    <>
      <InventoryTurnoverByAmountAlerts />
      <FinancialReportBody>
        {isLoading ? (
          <FinancialSheetSkeleton />
        ) : (
          <InventoryTurnoverByAmountTable companyName={organizationName} />
        )}
      </FinancialReportBody>
    </>
  );
}

export const InventoryTurnoverByAmountBody = InventoryTurnoverByAmountBodyJSX;
