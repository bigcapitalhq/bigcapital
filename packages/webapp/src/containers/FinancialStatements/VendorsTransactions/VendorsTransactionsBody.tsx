import React from 'react';
import * as R from 'ramda';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';
import { VendorsTransactionsTable } from './VendorsTransactionsTable';
import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

interface VendorsTransactionsBodyJSXProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

/**
 * Vendors transactions body.
 * @returns {JSX.Element}
 */
function VendorsTransactionsBodyJSX({
  // #withPreferences
  organizationName,
}: VendorsTransactionsBodyJSXProps) {
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

export const VendorsTransactionsBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(VendorsTransactionsBodyJSX);
