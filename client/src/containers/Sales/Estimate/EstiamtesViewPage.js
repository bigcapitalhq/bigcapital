import React, { useCallback } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import EstimateViewTabs from './EstimateViewTabs';
import EstimatesDataTable from './EstimatesDataTable';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Estimates list view page.
 */
function EstimatesViewPage({
  // #withAlertActions
  openAlert,
}) {
  const history = useHistory();

  // handle delete estimate click
  const handleDeleteEstimate = useCallback(
    ({ id }) => {
      openAlert('estimate-delete', { estimateId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm estimate deliver.
  const handleDeliverEstimate = useCallback(
    ({ id }) => {
      openAlert('estimate-deliver', { estimateId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm estimate approve.
  const handleApproveEstimate = useCallback(
    ({ id }) => {
      openAlert('estimate-Approve', { estimateId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm estimate reject.
  const handleRejectEstimate = useCallback(
    ({ id }) => {
      openAlert('estimate-reject', { estimateId: id });
    },
    [openAlert],
  );

  const handleEditEstimate = useCallback(
    (estimate) => {
      history.push(`/estimates/${estimate.id}/edit`);
    },
    [history],
  );

  return (
    <Switch>
      <Route
        exact={true}
        path={['/estimates/:custom_view_id/custom_view', '/estimates']}
      >
        <EstimateViewTabs />

        {/* <EstimatesDataTable
          onDeleteEstimate={handleDeleteEstimate}
          onEditEstimate={handleEditEstimate}
          onDeliverEstimate={handleDeliverEstimate}
          onApproveEstimate={handleApproveEstimate}
          onRejectEstimate={handleRejectEstimate}
          onSelectedRowsChange={handleSelectedRowsChange}
        /> */}
      </Route>
    </Switch>
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
)(EstimatesViewPage)