import React from 'react';
import { useHistory } from 'react-router-dom';
import { DataTable } from '../../../../../components';
import { useItemAssociatedInvoiceTransactions } from 'hooks/query';
import { useItemDetailDrawerContext } from '../../ItemDetailDrawerProvider';
import {
  useInvoicePaymentTransactionsColumns,
  ActionsMenu,
} from './components';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

/**
 * Invoice payment transactions.
 */
function InvoicePaymentTransactions({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  const columns = useInvoicePaymentTransactionsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch invoice associated transactions.
  const {
    isLoading: isInvoiceTransactionsLoading,
    isFetching: isInvoiceTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedInvoiceTransactions(itemId, {
    enabled: !!itemId,
  });

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
      loading={isInvoiceTransactionsLoading}
      headerLoading={isInvoiceTransactionsLoading}
      progressBarLoading={isInvoiceTransactionFetching}
      ContextMenu={ActionsMenu}
    />
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(InvoicePaymentTransactions);
