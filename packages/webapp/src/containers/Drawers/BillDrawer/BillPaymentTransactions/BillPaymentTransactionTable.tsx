// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DataTable, Card, TableSkeletonRows } from '@/components';

import { TableStyle } from '@/constants';
import { useBillPaymentTransactionsColumns, ActionsMenu } from './components';
import { useBillDrawerContext } from '../BillDrawerProvider';
import { useBillPaymentTransactions } from '@/hooks/query';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Bill payment transactions datatable.
 */
function BillPaymentTransactionTable({
  // #withAlertsActions
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
    history.push(`/payment-mades/${bill_payment_id}/edit`);
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
        styleName={TableStyle.Constraint}
        ContextMenu={ActionsMenu}
        payload={{
          onDelete: handleDeleteBillPaymentTransactons,
          onEdit: handleEditBillPaymentTransactions,
        }}
      />
    </Card>
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(BillPaymentTransactionTable);
