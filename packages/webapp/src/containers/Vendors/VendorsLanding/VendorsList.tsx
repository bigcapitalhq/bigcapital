// @ts-nocheck
import React, { useEffect } from 'react';

import '@/style/pages/Vendors/List.scss';

import { DashboardPageContent } from '@/components';

import { VendorsListProvider } from './VendorsListProvider';
import VendorActionsBar from './VendorActionsBar';
import VendorsTable from './VendorsTable';

import withVendors from './withVendors';
import withVendorsActions from './withVendorsActions';

import { compose } from '@/utils';

/**
 * Vendors list page.
 */
function VendorsList({
  // #withVendors
  vendorsTableState,
  vendorsTableStateChanged,

  // #withVendorsActions
  resetVendorsTableState,
}) {
  // Resets the vendors table state once the page unmount.
  useEffect(
    () => () => {
      resetVendorsTableState();
    },
    [resetVendorsTableState],
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

export default compose(
  withVendors(({ vendorsTableState, vendorsTableStateChanged }) => ({
    vendorsTableState,
    vendorsTableStateChanged,
  })),
  withVendorsActions,
)(VendorsList);
