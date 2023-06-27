// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import { TableStyle } from '@/constants';
import { DataTable, TableSkeletonRows } from '@/components';
import { useItemDetailDrawerContext } from '../../ItemDetailDrawerProvider';
import { useItemAssociatedReceiptTransactions } from '@/hooks/query';
import { useReceiptTransactionsColumns, ActionsMenu } from './components';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Receipt payment transactions.
 */
function ReceiptPaymentTransactions({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  const columns = useReceiptTransactionsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch receipts associated transactions.
  const {
    isLoading: isReceiptTransactionsLoading,
    isFetching: isReceiptTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedReceiptTransactions(itemId, {
    enabled: !!itemId,
  });

  // Handles delete payment transactions.
  const handleDeletePaymentTransactions = ({ receipt_id }) => {
    openAlert('receipt-delete', {
      receiptId: receipt_id,
    });
  };

  // Handles edit payment transactions.
  const handleEditPaymentTransactions = ({ receipt_id }) => {
    history.push(`/receipts/${receipt_id}/edit`);
    closeDrawer(DRAWERS.ITEM_DETAILS);
  };

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
      loading={isReceiptTransactionsLoading}
      headerLoading={isReceiptTransactionsLoading}
      progressBarLoading={isReceiptTransactionFetching}
      ContextMenu={ActionsMenu}
      payload={{
        onEdit: handleEditPaymentTransactions,
        onDelete: handleDeletePaymentTransactions,
      }}
      styleName={TableStyle.Constraint}
      TableLoadingRenderer={TableSkeletonRows}
      sticky={true}
    />
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(ReceiptPaymentTransactions);
