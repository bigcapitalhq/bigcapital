import React from 'react';
import { useHistory } from 'react-router-dom';
import { DataTable, Card } from 'components';

import 'style/pages/PaymentTransactions/List.scss';

import {
  useInvoicePaymentTransactionsColumns,
  ActionsMenu,
} from './components';
import { useInvoiceDetailDrawerContext } from '../InvoiceDetailDrawerProvider';
import { useInvoicePaymentTransactions } from 'hooks/query';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

/**
 * Invoice payment transactions datatable.
 */
function InvoicePaymentTransactionsTable({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();
  const columns = useInvoicePaymentTransactionsColumns();

  const { invoiceId } = useInvoiceDetailDrawerContext();

  // Fetch invoice payment transactions.
  const {
    data: paymentTransactions,
    isFetching: isPaymentTransactionFetching,
    isLoading: isPaymentTransactionLoading,
  } = useInvoicePaymentTransactions(invoiceId, {
    enabled: !!invoiceId,
  });

  // Handles delete payment transactions.
  const handleDeletePaymentTransactons = ({ payment_receive_id }) => {
    openAlert('payment-receive-delete', {
      paymentReceiveId: payment_receive_id,
    });
  };

  // Handles edit payment transactions.
  const handleEditPaymentTransactions = ({ payment_receive_id }) => {
    history.push(`/payment-receives/${payment_receive_id}/edit`);
    closeDrawer('invoice-detail-drawer');
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={paymentTransactions}
        loading={isPaymentTransactionLoading}
        headerLoading={isPaymentTransactionLoading}
        progressBarLoading={isPaymentTransactionFetching}
        ContextMenu={ActionsMenu}
        payload={{
          onDelete: handleDeletePaymentTransactons,
          onEdit: handleEditPaymentTransactions,
        }}
        className={'payment-transactions'}
      />
    </Card>
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(InvoicePaymentTransactionsTable);
