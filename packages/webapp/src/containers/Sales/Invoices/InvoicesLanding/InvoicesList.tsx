import React from 'react';

import '@/style/pages/SaleInvoice/List.scss';
import { InvoicesActionsBar } from './InvoicesActionsBar';
import { InvoicesDataTable } from './InvoicesDataTable';
import { InvoicesListDialogs } from './InvoicesListDialogs';
import { InvoicesListDrawers } from './InvoicesListDrawers';
import { InvoicesListProvider } from './InvoicesListProvider';
import { withInvoiceActions } from './withInvoiceActions';
import { withInvoices } from './withInvoices';
import type { WithInvoicesProps } from './withInvoices';
import { DashboardPageContent } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { transformTableStateToQuery, compose } from '@/utils';

interface WithInvoiceActionsProps {
  resetInvoicesTableState: () => void;
}

interface InvoicesListProps
  extends Pick<
      WithInvoicesProps,
      'invoicesTableState' | 'invoicesTableStateChanged'
    >,
    WithInvoiceActionsProps {}

function InvoicesListInner({
  invoicesTableState,
  invoicesTableStateChanged,
  resetInvoicesTableState,
}: InvoicesListProps) {
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
      <InvoicesListDrawers />
      <InvoicesListDialogs />

      <DashboardPageContent>
        <InvoicesDataTable />
      </DashboardPageContent>
    </InvoicesListProvider>
  );
}

export const InvoicesList = compose(
  withInvoices(({ invoicesTableState, invoicesTableStateChanged }) => ({
    invoicesTableState,
    invoicesTableStateChanged,
  })),
  withInvoiceActions,
  withAlertActions,
)(InvoicesListInner);
