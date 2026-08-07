import React from 'react';
import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';
import {
  useRefundCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';
import { DataTable, Card } from '@/components';
import { TableStyle } from '@/constants';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import { compose } from '@/utils';

interface RefundCreditNoteTransactionsTableInnerProps
  extends WithAlertActionsProps {}

/**
 * Refund credit note transactions table.
 */
function RefundCreditNoteTransactionsTableInner({
  // #withAlertActions
  openAlert,
}: RefundCreditNoteTransactionsTableInnerProps) {
  const { refundCreditNote } = useCreditNoteDetailDrawerContext();

  // Refund credit transactions table columns.
  const columns = useRefundCreditTransactionsTableColumns();

  // Handle delete refund credit.
  const handleDeleteRefundCreditNote = ({ id }: { id: number }) => {
    openAlert('refund-credit-delete', { creditNoteId: id });
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={refundCreditNote ?? []}
        ContextMenu={ActionsMenu}
        styleName={TableStyle.Constrant}
        payload={{
          onDelete: handleDeleteRefundCreditNote,
        }}
      />
    </Card>
  );
}

export const RefundCreditNoteTransactionsTable = compose(withAlertActions)(
  RefundCreditNoteTransactionsTableInner,
);
