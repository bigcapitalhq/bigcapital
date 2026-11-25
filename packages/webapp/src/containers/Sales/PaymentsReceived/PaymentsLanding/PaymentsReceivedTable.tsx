import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { usePaymentReceivesColumns, ActionsMenu } from './components';
import { PaymentsReceivedEmptyStatus as PaymentReceivesEmptyStatus } from './PaymentsReceivedEmptyStatus';
import { usePaymentsReceivedListContext } from './PaymentsReceivedListProvider';
import { withPaymentsReceived } from './withPaymentsReceived';
import { withPaymentsReceivedActions } from './withPaymentsReceivedActions';
import type { PaymentReceiveTableRow } from './components';
import type { WithPaymentsReceivedProps } from './withPaymentsReceived';
import type { WithPaymentsReceivedActionsProps } from './withPaymentsReceivedActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { isSmallTableSize, TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.PAYMENT_RECEIVES,
  rowName: 'payment-received',
  identifierColumn: 'payment_receive_no',
  ActionsMenu,
});

interface PaymentsReceivedDataTableProps
  extends Pick<
      WithPaymentsReceivedProps,
      'paymentReceivesTableState' | 'paymentReceivesSelectedRows'
    >,
    WithPaymentsReceivedActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    WithDialogActionsProps {}

function PaymentsReceivedDataTable({
  setPaymentReceivesTableState,
  setPaymentReceivesSelectedRows,
  paymentReceivesTableState,
  paymentReceivesSelectedRows,
  openAlert,
  openDrawer,
  openDialog,
}: PaymentsReceivedDataTableProps) {
  const history = useHistory();

  const {
    paymentReceives,
    pagination,
    isPaymentReceivesLoading,
    isPaymentReceivesFetching,
    isEmptyStatus,
    paymentReceiveSettings,
  } = usePaymentsReceivedListContext();

  const columns = usePaymentReceivesColumns();

  const handleEditPaymentReceive = ({ id }: PaymentReceiveTableRow) => {
    history.push(`/payments-received/${id}/edit`);
  };

  const handleDeletePaymentReceive = ({ id }: PaymentReceiveTableRow) => {
    openAlert('payment-received-delete', { paymentReceiveId: id });
  };

  const handleViewDetailPaymentReceive = ({ id }: PaymentReceiveTableRow) => {
    openDrawer(DRAWERS.PAYMENT_RECEIVED_DETAILS, { paymentReceiveId: id });
  };

  const handleSendMailPayment = ({ id }: PaymentReceiveTableRow) => {
    openDrawer(DRAWERS.PAYMENT_RECEIVED_SEND_MAIL, { paymentReceivedId: id });
  };

  if (isEmptyStatus) {
    return <PaymentReceivesEmptyStatus />;
  }

  const actions = {
    onDelete: handleDeletePaymentReceive,
    onEdit: handleEditPaymentReceive,
    onViewDetails: handleViewDetailPaymentReceive,
    onSendMail: handleSendMailPayment,
  };

  return (
    <Table
      columns={columns}
      data={paymentReceives}
      total={pagination?.total}
      loading={isPaymentReceivesLoading}
      fetching={isPaymentReceivesFetching}
      compact={isSmallTableSize(paymentReceiveSettings?.tableSize)}
      query={paymentReceivesTableState}
      setQuery={setPaymentReceivesTableState}
      selectedIds={paymentReceivesSelectedRows}
      setSelectedIds={setPaymentReceivesSelectedRows}
      actions={actions}
    />
  );
}

export const PaymentsReceivedTable = FF.pipe(
  PaymentsReceivedDataTable,
  withPaymentsReceived(
    ({ paymentReceivesTableState, paymentReceivesSelectedRows }) => ({
      paymentReceivesTableState,
      paymentReceivesSelectedRows,
    }),
  ),
  withDialogActions,
  withDrawerActions,
  withAlertActions,
  withPaymentsReceivedActions,
);
