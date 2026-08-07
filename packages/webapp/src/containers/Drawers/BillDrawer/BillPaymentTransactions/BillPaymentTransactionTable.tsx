import { useHistory } from 'react-router-dom';
import { useBillDrawerContext } from '../BillDrawerProvider';
import { useBillPaymentTransactionsColumns, ActionsMenu } from './components';
import type { BillPaymentTransactionsResponse } from '@bigcapital/sdk-ts';
import { DataTable, Card, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { useBillPaymentTransactions } from '@/hooks/query';
import { compose } from '@/utils';

type BillPaymentTransaction = BillPaymentTransactionsResponse[number];

interface BillPaymentTransactionTableInnerProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Bill payment transactions datatable.
 */
function BillPaymentTransactionTableInner({
  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}: BillPaymentTransactionTableInnerProps) {
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
  const handleDeleteBillPaymentTransactons = (
    row: Pick<BillPaymentTransaction, 'billPaymentId'>,
  ) => {
    openAlert('payment-made-delete', {
      paymentMadeId: row.billPaymentId,
    });
  };

  // Handles edit  bill payment transactions.
  const handleEditBillPaymentTransactions = (
    row: Pick<BillPaymentTransaction, 'billPaymentId'>,
  ) => {
    history.push(`/payments-made/${row.billPaymentId}/edit`);
    closeDrawer(DRAWERS.BILL_DETAILS);
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={paymentTransactions ?? []}
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

export const BillPaymentTransactionTable = compose(
  withAlertActions,
  withDrawerActions,
)(BillPaymentTransactionTableInner);
