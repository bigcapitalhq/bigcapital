// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DataTable, Card, TableSkeletonRows } from '@/components';

import { TableStyle } from '@/constants';
import { useBillPaymentTransactionsColumns, ActionsMenu } from './components';
import { useBillDrawerContext } from '../BillDrawerProvider';
import { useBillPaymentTransactions } from '@/hooks/query';

import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

import { DRAWERS } from '@/constants/drawers';
import { flow } from 'fp-ts/function';

/**
 * Bill payment transactions datatable.
 */
function BillPaymentTransactionTableInner({
  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  const columns = useBillPaymentTransactionsColumns();

  const { billId } = useBillDrawerContext();

  // Handle fetch bill payment transaction.
  const {
    isLoading: isPaymentTransactionsLoading,
    isFetching: isPaymentTransactionFetching,
    data: paymentTransactions,
  } = useBillPaymentTransactions(billId, {
    enabled: !!billId,
  });

  // Handles delete bill payment transactions.
  const handleDeleteBillPaymentTransactons = ({ bill_payment_id }) => {
    openAlert('payment-made-delete', {
      paymentMadeId: bill_payment_id,
    });
  };

  // Handles edit  bill payment transactions.
  const handleEditBillPaymentTransactions = ({ bill_payment_id }) => {
    history.push(`/payments-made/${bill_payment_id}/edit`);
    closeDrawer(DRAWERS.BILL_DETAILS);
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={paymentTransactions}
        loading={isPaymentTransactionsLoading}
        headerLoading={isPaymentTransactionsLoading}
        progressBarLoading={isPaymentTransactionFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constrant}
        ContextMenu={ActionsMenu}
        payload={{
          onDelete: handleDeleteBillPaymentTransactons,
          onEdit: handleEditBillPaymentTransactions,
        }}
      />
    </Card>
  );
}

export const BillPaymentTransactionTable = flow(
  withDrawerActions,
  withAlertActions,
)(BillPaymentTransactionTableInner);
