import React from 'react';

import 'style/pages/SaleInvoice/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';
import InvoiceActionsBar from './InvoiceActionsBar';
import { InvoicesListProvider } from './InvoicesListProvider';

import InvoiceViewTabs from './InvoiceViewTabs';
import InvoicesDataTable from './InvoicesDataTable';
import InvoicesAlerts from '../InvoicesAlerts';

import withInvoices from './withInvoices';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Sale invoices list.
 */
function InvoicesList({
  // #withInvoice
  invoicesTableState,
}) {
  return (
    <InvoicesListProvider
      query={transformTableStateToQuery(invoicesTableState)}
    >
      <InvoiceActionsBar />

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
  withAlertsActions,
)(InvoicesList);
