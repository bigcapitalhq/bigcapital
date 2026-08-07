import React from 'react';
import { useHistory } from 'react-router-dom';
import { useItemDetailDrawerContext } from '../../ItemDetailDrawerProvider';
import {
  useReceiptTransactionsColumns,
  ActionsMenu,
  type ItemReceiptTransaction,
} from './components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { DataTable, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useItemAssociatedReceiptTransactions } from '@/hooks/query';
import { compose } from '@/utils';

interface ReceiptPaymentTransactionsInnerProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDrawerActionsProps, 'closeDrawer'> {}

/**
 * Receipt payment transactions.
 */
function ReceiptPaymentTransactions({
  openAlert,
  closeDrawer,
}: ReceiptPaymentTransactionsInnerProps) {
  const history = useHistory();
  const columns = useReceiptTransactionsColumns();
  const { itemId } = useItemDetailDrawerContext();
  const {
    isLoading: isReceiptTransactionsLoading,
    isFetching: isReceiptTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedReceiptTransactions(itemId, {
    enabled: !!itemId,
  });

  const handleDeletePaymentTransactons = ({
    receiptId,
  }: ItemReceiptTransaction) => {
    openAlert('receipt-delete', {
      receiptId,
    });
  };

  const handleEditPaymentTransactions = ({
    receiptId,
  }: ItemReceiptTransaction) => {
    history.push(`/receipts/${receiptId}/edit`);
    closeDrawer(DRAWERS.ITEM_DETAILS);
  };

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions ?? []}
      loading={isReceiptTransactionsLoading}
      headerLoading={isReceiptTransactionsLoading}
      progressBarLoading={isReceiptTransactionFetching}
      ContextMenu={ActionsMenu}
      payload={{
        onEdit: handleEditPaymentTransactions,
        onDelete: handleDeletePaymentTransactons,
      }}
      styleName={TableStyle.Constrant}
      TableLoadingRenderer={TableSkeletonRows}
      sticky={true}
    />
  );
}

export const index = compose(
  withAlertActions,
  withDrawerActions,
)(ReceiptPaymentTransactions);
