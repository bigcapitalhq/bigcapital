// @ts-nocheck
import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import { PaymentMadeViewTabs } from './PaymentMadeViewTabs';

import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

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

export const PaymentMadesView = flow(
  withDialogActions,
  withAlertActions,
)(PaymentMadesViewPage);
