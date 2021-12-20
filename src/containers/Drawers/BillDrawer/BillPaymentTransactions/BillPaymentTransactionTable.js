import React from 'react';
import { useHistory } from 'react-router-dom';
import { DataTable, Card } from 'components';

import { useBillPaymentTransactionsColumns, ActionsMenu } from './components';
import { useBillDrawerContext } from '../BillDrawerProvider';
import { useBillPaymentTransactions } from 'hooks/query';

import { TableStyle } from '../../../../common';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

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
  const handleDeleteBillPaymentTransactons = ({ bill_id }) => {
    openAlert('bill-delete', {
      billId: bill_id,
    });
  };

  // Handles edit  bill payment transactions.
  const handleEditBillPaymentTransactions = ({ bill_id }) => {
    history.push(`/bills/${bill_id}/edit`);
    closeDrawer('bill-drawer');
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

export default compose(
  withAlertsActions,
  withDrawerActions,
)(BillPaymentTransactionTable);
