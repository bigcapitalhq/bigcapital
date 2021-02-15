import React from 'react';

import 'style/pages/Vendors/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import { VendorsListProvider } from './VendorsListProvider';
import VendorActionsBar from './VendorActionsBar';
import VendorViewsTabs from './VendorViewsTabs';
import VendorsAlerts from '../VendorsAlerts';
import VendorsTable from './VendorsTable';

import withVendors from './withVendors';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Vendors list page.
 */
function VendorsList({
  // #withVendors
  vendorsTableState,
}) {
  return (
    <VendorsListProvider query={transformTableStateToQuery(vendorsTableState)}>
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
  withVendors(({ vendorsTableState }) => ({ vendorsTableState })),
)(VendorsList);
