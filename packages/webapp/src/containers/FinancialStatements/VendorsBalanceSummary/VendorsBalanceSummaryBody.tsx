import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';
import { VendorsBalanceSummaryTable } from './VendorsBalanceSummaryTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Vendor balance summary body.
 * @returns {JSX.Element}
 */
function VendorsBalanceSummaryBodyJSX() {
  const organizationName = useCurrentOrganizationName();
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

export const VendorBalanceSummaryBody = VendorsBalanceSummaryBodyJSX;
