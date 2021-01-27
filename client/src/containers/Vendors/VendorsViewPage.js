import React, { useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import VendorsViewsTabs from './VendorViewsTabs';
import VendorsTable from './VendorsTable';

import withVendorActions from './withVendorActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

function VendorsViewPage({
  // #withAlertsActions.
  openAlert,

  // #withVendorActions.
  setSelectedRowsVendors,
}) {
  const history = useHistory();

  // Handle Edit vendor data table
  const handleEditVendor = useCallback(
    (vendor) => {
      history.push(`/vendors/${vendor.id}/edit`);
    },
    [history],
  );

  // Handle click delete vendor.
  const handleDeleteVendor = useCallback(
    ({ id }) => {
      openAlert('vendor-delete', { vendorId: id });
    },
    [openAlert],
  );

  // Handle select vendor rows.
  const handleSelectedRowsChange = (selectedRows) => {
    const selectedRowsIds = selectedRows.map((r) => r.id);
    setSelectedRowsVendors(selectedRowsIds);
  };

  return (
    <Switch>
      <Route
        exact={true}
        path={['/vendors/:custom_view_id/custom_view', '/vendors']}
      >
        <VendorsViewsTabs />
        <VendorsTable
          onDeleteVendor={handleDeleteVendor}
          onEditVendor={handleEditVendor}
          onSelectedRowsChange={handleSelectedRowsChange}
        />
      </Route>
    </Switch>
  );
}

export default compose(withAlertsActions, withVendorActions)(VendorsViewPage);
