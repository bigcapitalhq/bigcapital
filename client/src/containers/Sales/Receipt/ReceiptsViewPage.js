import React, { useCallback } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import ReceiptViewTabs from './ReceiptViewTabs';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Sale receipts view page.
 */
function ReceiptsViewPage({
  // #withAlertActions
  openAlert,

  // #withDialog.
  openDialog,
}) {
  const history = useHistory();

  // handle delete receipt click
  const handleDeleteReceipt = useCallback(
    ({ id }) => {
      openAlert('receipt-delete', { receiptId: id });
    },
    [openAlert],
  );

  const handleSelectedRowsChange = useCallback((estimate) => {}, []);

  const handleEditReceipt = useCallback(
    (receipt) => {
      history.push(`/receipts/${receipt.id}/edit`);
    },
    [history],
  );

  // Handle cancel/confirm receipt deliver.
  const handleCloseReceipt = useCallback(
    ({ id }) => {
      openAlert('receipt-close', { receiptId: id });
    },
    [openAlert],
  );

  return (
    <Switch>
      <Route
        exact={true}
        path={['/receipts/:custom_view_id/custom_view', '/receipts']}
      >
        <ReceiptViewTabs />
        {/* <ReceiptsDataTable
              onDeleteReceipt={handleDeleteReceipt}
              onEditReceipt={handleEditReceipt}
              onCloseReceipt={handleCloseReceipt}
              onSelectedRowsChange={handleSelectedRowsChange}
            /> */}
      </Route>
    </Switch>
  );
}

export default compose(withAlertsActions, withDialogActions)(ReceiptsViewPage);
