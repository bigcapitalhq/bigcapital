// @ts-nocheck
import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import PaymentMadeViewTabs from './PaymentMadeViewTabs';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';

/**
 * Payments made view page.
 */
function PaymentsMadeViewPage({
  // #withAlertActions
  openAlert,
}) {
  return (
    <Switch>
      <Route
        exact={true}
        path={['/payments-made/:custom_view_id/custom_view', '/payments-made']}
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
)(PaymentsMadeViewPage);
