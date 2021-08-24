import React, { useEffect } from 'react';

import 'style/pages/Vendors/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import { VendorsListProvider } from './VendorsListProvider';
import VendorActionsBar from './VendorActionsBar';
import VendorViewsTabs from './VendorViewsTabs';
import VendorsAlerts from '../VendorsAlerts';
import VendorsTable from './VendorsTable';

import withVendors from './withVendors';
import withVendorsActions from './withVendorsActions';

import { compose } from 'utils';

/**
 * Vendors list page.
 */
function VendorsList({
  // #withVendors
  vendorsTableState,
  vendorsTableStateChanged,

  // #withVendorsActions
  setVendorsTableState,
}) {
  // Resets the vendors table state once the page unmount.
  useEffect(
    () => () => {
      setVendorsTableState({
        filterRoles: [],
        viewSlug: '',
        pageIndex: 0,
      });
    },
    [setVendorsTableState],
  );

  return (
    <VendorsListProvider
      tableState={vendorsTableState}
      tableStateChanged={vendorsTableStateChanged}
    >
      <VendorActionsBar />

      <DashboardPageContent>
        <VendorViewsTabs />

        <DashboardContentTable>
          <VendorsTable />
        </DashboardContentTable>

        <VendorsAlerts />
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
