import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import PaymentMadeViewTabs from './PaymentMadeViewTabs';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Payment mades view page.
 */
function PaymentMadesViewPage({
  // #withAlertActions
  openAlert,
}) {
  return (
    <Switch>
      <Route
        exact={true}
        path={['/payment-mades/:custom_view_id/custom_view', '/payment-mades']}
      >
        
        {/* <PaymentMadeDataTable
              onDeletePaymentMade={handleDeletePaymentMade}
              onEditPaymentMade={handleEditPaymentMade}
              onSelectedRowsChange={handleSelectedRowsChange}
            /> */}
      </Route>
    </Switch>
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
)(PaymentMadesViewPage);
