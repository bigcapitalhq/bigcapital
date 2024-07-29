// @ts-nocheck
import React from 'react';

import '@/style/pages/SaleInvoice/List.scss';

import { DashboardPageContent } from '@/components';
import { InvoicesListProvider } from './InvoicesListProvider';

import InvoicesDataTable from './InvoicesDataTable';
import InvoicesActionsBar from './InvoicesActionsBar';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';

import { transformTableStateToQuery, compose } from '@/utils';

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
        <InvoicesDataTable />
      </DashboardPageContent>
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
