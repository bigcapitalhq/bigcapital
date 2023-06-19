// @ts-nocheck
import React from 'react';
import { DataTable, Card } from '@/components';

import { TableStyle } from '@/constants';
import withAlertsActions from '@/containers/Alert/withAlertActions';

import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';
import {
  useRefundCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';

import { compose } from '@/utils';

/**
 * Refund credit note transactions table.
 */
function RefundCreditNoteTransactionsTable({
  // #withAlertsActions
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
        styleName={TableStyle.Constraint}
        payload={{
          onDelete: handleDeleteRefundCreditNote,
        }}
      />
    </Card>
  );
}

export default compose(withAlertsActions)(RefundCreditNoteTransactionsTable);
