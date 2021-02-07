import React, { useCallback } from 'react';

import { Switch, Route, useHistory } from 'react-router-dom';
import BillViewTabs from './BillViewTabs';
import BillsDataTable from './BillsDataTable';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

function BillsViewPage() {
  const history = useHistory();

  const handleEditBill = useCallback((bill) => {
    history.push(`/bills/${bill.id}/edit`);
  });

  const handleDeleteBill = () => {

  };


  const handleOpenBill = () => {

  };

  const handleSelectedRowsChange = () => {

  }

  return (
    <Switch>
      <Route
        exact={true}
        path={['/bills/:custom_view_id/custom_view', '/bills']}
      >
        <BillViewTabs />
        {/* <BillsDataTable
          onDeleteBill={handleDeleteBill}
          onEditBill={handleEditBill}
          onOpenBill={handleOpenBill}
          onSelectedRowsChange={handleSelectedRowsChange}
        /> */}
      </Route>
    </Switch>
  );
}
export default compose(withAlertsActions, withDialogActions)(BillsViewPage);
