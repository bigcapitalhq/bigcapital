import React from 'react';

import 'style/pages/SaleInvoice/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';
import InvoicesActionsBar from './InvoicesActionsBar';
import { InvoicesListProvider } from './InvoicesListProvider';

import InvoiceViewTabs from './InvoiceViewTabs';
import InvoicesDataTable from './InvoicesDataTable';
import InvoicesAlerts from '../InvoicesAlerts';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Sale invoices list.
 */
function InvoicesList({
  // #withInvoice
  invoicesTableState,
  invoicesTableStateChanged,

  // #withInvoicesActions
  resetInvoicesTableState,
}) {
  // Resets the invoices table state once the page unmount.
  React.useEffect(
    () => () => {
      resetInvoicesTableState();
    },
    [resetInvoicesTableState],
  );

  return (
    <InvoicesListProvider
      query={transformTableStateToQuery(invoicesTableState)}
      tableStateChanged={invoicesTableStateChanged}
    >
      <InvoicesActionsBar />

      <DashboardPageContent>
        <InvoiceViewTabs />
        <InvoicesDataTable />
      </DashboardPageContent>

      <InvoicesAlerts />
    </InvoicesListProvider>
  );
}

export default compose(
  withInvoices(({ invoicesTableState, invoicesTableStateChanged }) => ({
    invoicesTableState,
    invoicesTableStateChanged,
  })),
  withInvoiceActions,
  withAlertsActions,
)(InvoicesList);
