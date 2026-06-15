// @ts-nocheck
import React from 'react';
import { DataTable, Card } from '@/components';

import { TableStyle } from '@/constants';
import { withAlertActions } from '@/containers/Alert/withAlertActions';

import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';
import {
  useRefundCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';
import { flow } from 'fp-ts/function';

/**
 * Refund credit note transactions table.
 */
function RefundCreditNoteTransactionsTableInner({
  // #withAlertActions
  openAlert,
}) {
  const { refundCreditNote } = useCreditNoteDetailDrawerContext();

  // Refund credit transactions table columns.
  const columns = useRefundCreditTransactionsTableColumns();

  // Handle delete refund credit.
  const handleDeleteRefundCreditNote = ({ id }) => {
    openAlert('refund-credit-delete', { creditNoteId: id });
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={refundCreditNote}
        ContextMenu={ActionsMenu}
        styleName={TableStyle.Constrant}
        payload={{
          onDelete: handleDeleteRefundCreditNote,
        }}
      />
    </Card>
  );
}

export const RefundCreditNoteTransactionsTable = flow(
  withAlertActions,
)(RefundCreditNoteTransactionsTableInner);
