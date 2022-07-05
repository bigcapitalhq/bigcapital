import React from 'react';
import * as R from 'ramda';

import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '../../../components/FinancialSheet';

import SalesByItemsTable from './SalesByItemsTable';

import { useSalesByItemsContext } from './SalesByItemProvider';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 *
 * @returns {JSX.Element}
 */
function SalesByItemsBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isLoading } = useSalesByItemsContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <SalesByItemsTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const SalesByItemsBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(SalesByItemsBodyJSX);
