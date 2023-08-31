// @ts-nocheck
import React from 'react';

import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components';
import { SalesTaxLiabilitySummaryTable } from './SalesTaxLiabilitySummaryTable';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import { compose } from '@/utils';

/**
 * Sales tax liability summary body.
 * @returns {React.JSX}
 */
function SalesTaxLiabilitySummaryBodyRoot({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isLoading } = useSalesTaxLiabilitySummaryContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <SalesTaxLiabilitySummaryTable />
      )}
    </FinancialReportBody>
  );
}

export const SalesTaxLiabilitySummaryBody = compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(SalesTaxLiabilitySummaryBodyRoot);
