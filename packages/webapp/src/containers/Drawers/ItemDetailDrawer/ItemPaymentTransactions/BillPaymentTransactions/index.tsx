import React from 'react';
import { useHistory } from 'react-router-dom';
import { useItemDetailDrawerContext } from '../../ItemDetailDrawerProvider';
import {
  useBillTransactionsColumns,
  ActionsMenu,
  type ItemBillTransaction,
} from './components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { DataTable, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useItemAssociatedBillTransactions } from '@/hooks/query';
import { compose } from '@/utils';

interface BillPaymentTransactionsInnerProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDrawerActionsProps, 'closeDrawer'> {}

/**
 * Bill payment transactions data table.
 */
function BillPaymentTransactions({
  openAlert,
  closeDrawer,
}: BillPaymentTransactionsInnerProps) {
  const history = useHistory();
  const columns = useBillTransactionsColumns();
  const { itemId } = useItemDetailDrawerContext();
  const {
    isLoading: isBillTransactionsLoading,
    isFetching: isBillTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedBillTransactions(itemId, {
    enabled: !!itemId,
  });

  const handleDeletePaymentTransactons = ({ billId }: ItemBillTransaction) => {
    openAlert('bill-delete', {
      billId,
    });
  };

  const handleEditPaymentTransactions = ({ billId }: ItemBillTransaction) => {
    history.push(`/bills/${billId}/edit`);
    closeDrawer(DRAWERS.ITEM_DETAILS);
  };
  return (
    <DataTable
      columns={columns}
      data={paymentTransactions ?? []}
      loading={isBillTransactionsLoading}
      headerLoading={isBillTransactionsLoading}
      progressBarLoading={isBillTransactionFetching}
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
)(BillPaymentTransactions);
