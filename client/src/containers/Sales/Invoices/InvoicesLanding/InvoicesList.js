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

  // #withInvoicesActions
  setInvoicesTableState
}) {
  // Resets the invoices table state once the page unmount.
  React.useEffect(
    () => () => {
      setInvoicesTableState({
        filterRoles: [],
        viewSlug: '',
        pageIndex: 0,
      });
    },
    [setInvoicesTableState],
  );

  return (
    <InvoicesListProvider
      query={transformTableStateToQuery(invoicesTableState)}
    >
      <InvoicesActionsBar />

      <DashboardPageContent>
        <InvoiceViewTabs />

        <DashboardContentTable>
          <InvoicesDataTable />
        </DashboardContentTable>
      </DashboardPageContent>

      <InvoicesAlerts />
    </InvoicesListProvider>
  );
}

export default compose(
  withInvoices(({ invoicesTableState }) => ({ invoicesTableState })),
  withInvoiceActions,
  withAlertsActions,
)(InvoicesList);
