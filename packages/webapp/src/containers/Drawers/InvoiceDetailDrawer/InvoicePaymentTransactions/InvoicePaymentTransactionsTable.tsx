// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DataTable, Card, TableSkeletonRows } from '@/components';

import {
  useInvoicePaymentTransactionsColumns,
  ActionsMenu,
} from './components';
import { useInvoiceDetailDrawerContext } from '../InvoiceDetailDrawerProvider';
import { useInvoicePaymentTransactions } from '@/hooks/query';

import { TableStyle } from '@/constants';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

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

  // Invoice payment transactions table columns.
  const columns = useInvoicePaymentTransactionsColumns();

  // Invoice drawer context.
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
    closeDrawer(DRAWERS.INVOICE_DETAILS);
  };
  return (
    <Card>
      <DataTable
        columns={columns}
        data={paymentTransactions}
        loading={isPaymentTransactionLoading}
        headerLoading={isPaymentTransactionLoading}
        progressBarLoading={isPaymentTransactionFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constraint}
        ContextMenu={ActionsMenu}
        payload={{
          onDelete: handleDeletePaymentTransactons,
          onEdit: handleEditPaymentTransactions,
        }}
      />
    </Card>
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(InvoicePaymentTransactionsTable);
