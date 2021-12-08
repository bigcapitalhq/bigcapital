import React from 'react';
import { DataTable, Card } from 'components';

import '../../../../style/pages/RefundCreditNote/List.scss';

import withAlertsActions from 'containers/Alert/withAlertActions';

import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';
import {
  useRefundCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';

import { compose } from 'utils';

/**
 * Refund credit note transactions table.
 */
function RefundCreditNoteTransactionsTable({
  // #withAlertsActions
  openAlert,
}) {
  const { refundCreditNote } = useCreditNoteDetailDrawerContext();

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
        payload={{
          onDelete: handleDeleteRefundCreditNote,
        }}
        className={'datatable--refund-transactions'}
      />
    </Card>
  );
}

export default compose(withAlertsActions)(RefundCreditNoteTransactionsTable);
