import React, { useCallback } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import InvoicesDataTable from './InvoicesDataTable';
import InvoiceViewTabs from './InvoiceViewTabs';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Invoices list view page.
 */
function InvoicesViewPage({
  // #withAlertActions
  openAlert,
}) {
  const history = useHistory();

  // Handle delete sale invoice.
  const handleDeleteInvoice = useCallback(
    ({ id }) => {
      openAlert('invoice-delete', { invoiceId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm invoice deliver.
  const handleDeliverInvoice = useCallback(
    ({ id }) => {
      openAlert('invoice-deliver', { invoiceId: id });
    },
    [openAlert],
  );

  // Handle edit sale invoice.
  const handleEditInvoice = useCallback(
    (invoice) => {
      history.push(`/invoices/${invoice.id}/edit`);
    },
    [history],
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (invoices) => {

    },
    [],
  );
  return (
    <Switch>
      <Route
        exact={true}
        path={['/invoices/:custom_view_id/custom_view', '/invoices']}
      >
        <InvoiceViewTabs />
        {/* <InvoicesDataTable
          onDeleteInvoice={handleDeleteInvoice}
          onEditInvoice={handleEditInvoice}
          onDeliverInvoice={handleDeliverInvoice}
          onSelectedRowsChange={handleSelectedRowsChange}
        /> */}
      </Route>
    </Switch>
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
)(InvoicesViewPage)