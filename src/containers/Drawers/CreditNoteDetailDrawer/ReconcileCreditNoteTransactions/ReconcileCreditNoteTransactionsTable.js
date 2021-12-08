import React from 'react';
import { DataTable, Card } from 'components';

import '../../../../style/pages/RefundCreditNote/List.scss';

import withAlertsActions from 'containers/Alert/withAlertActions';

import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';

import {
  useReconcileCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';

import { compose } from 'utils';

/**
 * Reconcile credit transactions table.
 */
function RefundCreditNoteTransactionsTable({
  // #withAlertsActions
  openAlert,
}) {
  const { reconcileCreditNotes } = useCreditNoteDetailDrawerContext();

  const columns = useReconcileCreditTransactionsTableColumns();

  // Handle delete reconile credit.
  const handleDeleteReconcileCreditNote = ({ id }) => {
    openAlert('reconcile-credit-delete', { creditNoteId: id });
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={reconcileCreditNotes}
        ContextMenu={ActionsMenu}
        payload={{
          onDelete: handleDeleteReconcileCreditNote,
        }}
        className={'datatable--refund-transactions'}
      />
    </Card>
  );
}

export default compose(withAlertsActions)(RefundCreditNoteTransactionsTable);
