import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';
import { VendorsTransactionsTable } from './VendorsTransactionsTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Vendors transactions body.
 * @returns {JSX.Element}
 */
function VendorsTransactionsBodyJSX() {
  const organizationName = useCurrentOrganizationName();
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

export const VendorsTransactionsBody = VendorsTransactionsBodyJSX;
