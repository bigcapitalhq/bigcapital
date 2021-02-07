import React, { useCallback } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import PaymentReceivesDataTable from './PaymentReceivesDataTable';
import PaymentReceiveViewTabs from './PaymentReceiveViewTabs';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Payment receives view page.
 */
function PaymentReceivesViewPage({
  // #withAlertActions
  openAlert,
}) {
  const history = useHistory();

  // Handle delete Payment Receive
  const handleDeletePaymentReceive = ({ id }) => {
    openAlert('payment-receive-delete', { paymentReceiveId: id });
  };

  // Handle edit payment receive.
  const handleEditPaymentReceive = (payment) => {
    history.push(`/payment-receives/${payment.id}/edit`);
  };

  return (
    <Switch>
      <Route
        exact={true}
        path={[
          '/payment-receives/:custom_view_id/custom_view',
          '/payment-receives',
        ]}
      >
        <PaymentReceiveViewTabs />

        {/* <PaymentReceivesDataTable
          onDeletePaymentReceive={handleDeletePaymentReceive}
          onEditPaymentReceive={handleEditPaymentReceive}
          onSelectedRowsChange={handleSelectedRowsChange}
        /> */}
      </Route>
    </Switch>
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
)(PaymentReceivesViewPage)