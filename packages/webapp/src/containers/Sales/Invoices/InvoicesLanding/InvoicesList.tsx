// @ts-nocheck
import React from 'react';

import '@/style/pages/SaleInvoice/List.scss';

import { DashboardPageContent } from '@/components';
import { InvoicesListProvider } from './InvoicesListProvider';

import { InvoicesDataTable } from './InvoicesDataTable';
import { InvoicesActionsBar } from './InvoicesActionsBar';

import { withInvoices } from './withInvoices';
import { withInvoiceActions } from './withInvoiceActions';
import { withAlertActions } from '@/containers/Alert/withAlertActions';

import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Sale invoices list.
 */
function InvoicesListInner({
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

export const InvoicesList = flow(
  withAlertActions,
  withInvoiceActions,
  withInvoices(({ invoicesTableState, invoicesTableStateChanged }) => ({
    invoicesTableState,
    invoicesTableStateChanged,
  })),
)(InvoicesListInner);
