// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import PurchasesByItemsTable from './PurchasesByItemsTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Purchases by items.
 * @returns {JSX.Element}
 */
function PurchasesByItemsBodyJSX({
  // #withPreferences
  organizationName,
}) {
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

export const PurchasesByItemsBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(PurchasesByItemsBodyJSX);
