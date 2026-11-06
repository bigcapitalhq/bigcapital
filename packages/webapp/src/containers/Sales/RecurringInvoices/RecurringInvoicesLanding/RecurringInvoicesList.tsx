import * as FF from 'fp-ts/function';
import { useEffect } from 'react';
import { RecurringInvoicesActionsBar } from './RecurringInvoicesActionsBar';
import { RecurringInvoicesDataTable } from './RecurringInvoicesDataTable';
import { RecurringInvoicesEmptyStatus } from './RecurringInvoicesEmptyStatus';
import { RecurringInvoicesListProvider } from './RecurringInvoicesListProvider';
import { useRecurringInvoicesListContext } from './RecurringInvoicesListProvider';
import { withRecurringInvoices } from './withRecurringInvoices';
import { withRecurringInvoicesActions } from './withRecurringInvoicesActions';
import type { WithRecurringInvoicesProps } from './withRecurringInvoices';
import type { WithRecurringInvoiceActionsProps } from './withRecurringInvoicesActions';
import { DashboardPageContent } from '@/components';

interface RecurringInvoicesListInnerProps
  extends Pick<
      WithRecurringInvoicesProps,
      'recurringInvoicesTableState' | 'recurringInvoicesTableStateChanged'
    >,
    WithRecurringInvoiceActionsProps {}

function RecurringInvoicesListContent() {
  const { isEmptyStatus } = useRecurringInvoicesListContext();

  if (isEmptyStatus) {
    return <RecurringInvoicesEmptyStatus />;
  }
  return (
    <DashboardPageContent>
      <RecurringInvoicesDataTable />
    </DashboardPageContent>
  );
}

function RecurringInvoicesListInner({
  recurringInvoicesTableState,
  recurringInvoicesTableStateChanged,
  resetRecurringInvoicesTableState,
  resetRecurringInvoicesSelectedRows,
}: RecurringInvoicesListInnerProps) {
  useEffect(
    () => () => {
      resetRecurringInvoicesTableState();
      resetRecurringInvoicesSelectedRows();
    },
    [resetRecurringInvoicesTableState, resetRecurringInvoicesSelectedRows],
  );

  return (
    <RecurringInvoicesListProvider
      tableState={recurringInvoicesTableState}
      tableStateChanged={recurringInvoicesTableStateChanged}
    >
      <RecurringInvoicesActionsBar
        recurringInvoicesFilterRoles={
          recurringInvoicesTableState?.filterRoles || []
        }
      />
      <RecurringInvoicesListContent />
    </RecurringInvoicesListProvider>
  );
}

export const RecurringInvoicesList = FF.pipe(
  RecurringInvoicesListInner,
  withRecurringInvoices(
    ({ recurringInvoicesTableState, recurringInvoicesTableStateChanged }) => ({
      recurringInvoicesTableState,
      recurringInvoicesTableStateChanged,
    }),
  ),
  withRecurringInvoicesActions,
);
