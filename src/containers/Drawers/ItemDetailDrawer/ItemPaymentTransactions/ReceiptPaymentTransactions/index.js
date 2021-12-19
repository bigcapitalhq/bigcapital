import React from 'react';
import { useHistory } from 'react-router-dom';

import { DataTable } from '../../../../../components';
import { useItemDetailDrawerContext } from '../../ItemDetailDrawerProvider';
import { useItemAssociatedReceiptTransactions } from 'hooks/query';
import { useReceiptTransactionsColumns, ActionsMenu } from './components';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

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

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
      loading={isReceiptTransactionsLoading}
      headerLoading={isReceiptTransactionsLoading}
      progressBarLoading={isReceiptTransactionFetching}
      ContextMenu={ActionsMenu}
    />
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(ReceiptPaymentTransactions);
