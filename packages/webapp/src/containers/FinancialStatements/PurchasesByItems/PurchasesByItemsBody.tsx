import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';
import { PurchasesByItemsTable } from './PurchasesByItemsTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Purchases by items.
 */
function PurchasesByItemsBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading } = usePurchaseByItemsContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <PurchasesByItemsTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const PurchasesByItemsBody = PurchasesByItemsBodyJSX;
