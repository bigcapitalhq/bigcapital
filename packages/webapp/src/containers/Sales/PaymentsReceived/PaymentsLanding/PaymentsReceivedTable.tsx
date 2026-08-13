import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { usePaymentReceivesColumns, ActionsMenu } from './components';
import { PaymentsReceivedEmptyStatus as PaymentReceivesEmptyStatus } from './PaymentsReceivedEmptyStatus';
import { usePaymentsReceivedListContext } from './PaymentsReceivedListProvider';
import { withPaymentsReceived } from './withPaymentsReceived';
import { withPaymentsReceivedActions } from './withPaymentsReceivedActions';
import type { PaymentReceiveTableRow } from './components';
import type { WithPaymentsReceivedProps } from './withPaymentsReceived';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface WithPaymentsReceivedActionsProps {
  setPaymentReceivesTableState: (state: Record<string, any>) => void;
  setPaymentReceivesSelectedRows: (ids: number[]) => void;
}

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
  const paymentReceivesTableSize = paymentReceiveSettings?.tableSize as
    | string
    | undefined;

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

  const handleCellClick = (cell: any, _event: React.MouseEvent) => {
    openDrawer(DRAWERS.PAYMENT_RECEIVED_DETAILS, {
      paymentReceiveId: cell.row.original.id,
    });
  };

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PAYMENT_RECEIVES);

  const handleDataTableFetchData = useCallback(
    ({
      pageIndex,
      pageSize,
      sortBy,
    }: {
      pageSize: number;
      pageIndex: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setPaymentReceivesTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setPaymentReceivesTableState],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows: Array<{ original: PaymentReceiveTableRow }>) => {
      const selectedIds = selectedRows?.map((row) => row.original.id) || [];
      setPaymentReceivesSelectedRows(selectedIds);
    },
    [setPaymentReceivesSelectedRows],
  );

  if (isEmptyStatus) {
    return <PaymentReceivesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={paymentReceives ?? []}
        loading={isPaymentReceivesLoading}
        headerLoading={isPaymentReceivesLoading}
        progressBarLoading={isPaymentReceivesFetching}
        onFetchData={handleDataTableFetchData}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={paymentReceivesSelectedRows}
        autoResetSelectedRows={false}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        autoResetSortBy={false}
        autoResetPage={false}
        pagination={true}
        initialPageSize={paymentReceivesTableState?.pageSize ?? 10}
        rowsCount={pagination?.total ?? 0}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={paymentReceivesTableSize}
        payload={{
          onDelete: handleDeletePaymentReceive,
          onEdit: handleEditPaymentReceive,
          onViewDetails: handleViewDetailPaymentReceive,
          onSendMail: handleSendMailPayment,
        }}
      />
    </DashboardContentTable>
  );
}

export const PaymentsReceivedTable = compose(
  withPaymentsReceivedActions,
  withAlertActions,
  withDrawerActions,
  withDialogActions,
  withPaymentsReceived(
    ({ paymentReceivesTableState, paymentReceivesSelectedRows }) => ({
      paymentReceivesTableState,
      paymentReceivesSelectedRows,
    }),
  ),
)(PaymentsReceivedDataTable);
