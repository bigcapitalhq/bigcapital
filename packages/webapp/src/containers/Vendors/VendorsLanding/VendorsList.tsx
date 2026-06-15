// @ts-nocheck
import React, { useEffect } from 'react';

import '@/style/pages/Vendors/List.scss';

import { DashboardPageContent } from '@/components';

import { VendorsListProvider } from './VendorsListProvider';
import { VendorActionsBar } from './VendorActionsBar';
import { VendorsTable } from './VendorsTable';

import { withVendors } from './withVendors';
import { withVendorsActions } from './withVendorsActions';
import { flow } from 'fp-ts/function';

/**
 * Vendors list page.
 */
function VendorsListInner({
  // #withVendors
  vendorsTableState,
  vendorsTableStateChanged,

  // #withVendorsActions
  resetVendorsTableState,
  resetVendorsSelectedRows,
}) {
  // Resets the vendors table state once the page unmount.
  useEffect(
    () => () => {
      resetVendorsTableState();
      resetVendorsSelectedRows();
    },
    [resetVendorsSelectedRows, resetVendorsTableState],
  );

  return (
    <VendorsListProvider
      tableState={vendorsTableState}
      tableStateChanged={vendorsTableStateChanged}
    >
      <VendorActionsBar />

      <DashboardPageContent>
        <VendorsTable />
      </DashboardPageContent>
    </VendorsListProvider>
  );
}

export const VendorsList = flow(
  withVendorsActions,
  withVendors(({ vendorsTableState, vendorsTableStateChanged }) => ({
    vendorsTableState,
    vendorsTableStateChanged,
  })),
)(VendorsListInner);
