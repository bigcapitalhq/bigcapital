import React from 'react';
import { useHistory } from 'react-router-dom';

import { DataTable } from '../../../../../components';
import { TableStyle } from 'common';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows'

import { useItemDetailDrawerContext } from '../../ItemDetailDrawerProvider';
import { useItemAssociatedBillTransactions } from 'hooks/query';
import { useBillTransactionsColumns, ActionsMenu } from './components';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

/**
 * Bill payment transactions data table.
 */
function BillPaymentTransactions({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  const columns = useBillTransactionsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch Estimate associated transactions.
  const {
    isLoading: isBillTransactionsLoading,
    isFetching: isBillTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedBillTransactions(itemId, {
    enabled: !!itemId,
  });

  // Handles delete payment transactions.
  const handleDeletePaymentTransactons = ({ bill_id }) => {
    openAlert('bill-delete', {
      billId: bill_id,
    });
  };

  // Handles edit payment transactions.
  const handleEditPaymentTransactions = ({ bill_id }) => {
    history.push(`/bills/${bill_id}/edit`);
    closeDrawer('item-detail-drawer');
  };
  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
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
    />
  );
}
export default compose(
  withAlertsActions,
  withDrawerActions,
)(BillPaymentTransactions);




