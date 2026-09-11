import * as FF from 'fp-ts/function';
import React from 'react';
import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';
import {
  useReconcileCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';
import { DataTable, Card } from '@/components';
import { TableStyle } from '@/constants';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';

interface ReconcileCreditNoteTransactionsTableInnerProps
  extends WithAlertActionsProps {}

/**
 * Reconcile credit transactions table.
 */
function ReconcileCreditNoteTransactionsTableInner({
  // #withAlertActions
  openAlert,
}: ReconcileCreditNoteTransactionsTableInnerProps) {
  // Credit note drawer context.
  const { reconcileCreditNotes } = useCreditNoteDetailDrawerContext();

  // Reconcile credit transactions table columns.
  const columns = useReconcileCreditTransactionsTableColumns();

  // Handle delete reconile credit.
  const handleDeleteReconcileCreditNote = ({ id }: { id: number }) => {
    openAlert('reconcile-credit-delete', { creditNoteId: id });
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={reconcileCreditNotes ?? []}
        ContextMenu={ActionsMenu}
        payload={{
          onDelete: handleDeleteReconcileCreditNote,
        }}
        styleName={TableStyle.Constrant}
        className={'datatable--refund-transactions'}
      />
    </Card>
  );
}

export const ReconcileCreditNoteTransactionsTable = FF.pipe(
  ReconcileCreditNoteTransactionsTableInner,
  withAlertActions,
);
