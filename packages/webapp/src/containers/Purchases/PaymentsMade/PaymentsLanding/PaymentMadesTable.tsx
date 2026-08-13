import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { usePaymentMadesTableColumns, ActionsMenu } from './components';
import { PaymentMadesEmptyStatus } from './PaymentMadesEmptyStatus';
import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import { withPaymentMade } from './withPaymentMade';
import { withPaymentMadeActions } from './withPaymentMadeActions';
import type { PaymentMadeTableRow } from './components';
import type { WithPaymentMadeProps } from './withPaymentMade';
import type { WithPaymentMadeActionsProps } from './withPaymentMadeActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
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
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface PaymentMadesTableProps
  extends Pick<
      WithPaymentMadeProps,
      'paymentMadesTableState' | 'paymentMadesSelectedRows'
    >,
    WithPaymentMadeActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

function PaymentMadesTableInner({
  setPaymentMadesTableState,
  setPaymentMadesSelectedRows,
  paymentMadesTableState,
  paymentMadesSelectedRows,
  openAlert,
  openDrawer,
}: PaymentMadesTableProps) {
  const columns = usePaymentMadesTableColumns();

  const {
    paymentMades,
    pagination,
    isEmptyStatus,
    isPaymentsLoading,
    isPaymentsFetching,
    billPaymentSettings,
  } = usePaymentMadesListContext();
  const paymentMadesTableSize = billPaymentSettings?.tableSize as
    | string
    | undefined;

  const history = useHistory();

  const handleEditPaymentMade = (paymentMade: PaymentMadeTableRow) => {
    history.push(`/payments-made/${paymentMade.id}/edit`);
  };

  const handleDeletePaymentMade = (paymentMade: PaymentMadeTableRow) => {
    openAlert('payment-made-delete', { paymentMadeId: paymentMade.id });
  };

  const handleViewDetailPaymentMade = ({ id }: PaymentMadeTableRow) => {
    openDrawer(DRAWERS.PAYMENT_MADE_DETAILS, { paymentMadeId: id });
  };

  const handleCellClick = (cell: any, _event: React.MouseEvent) => {
    openDrawer(DRAWERS.PAYMENT_MADE_DETAILS, {
      paymentMadeId: cell.row.original.id,
    });
  };

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PAYMENT_MADES);

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
      setPaymentMadesTableState({ pageIndex, pageSize, sortBy });
    },
    [setPaymentMadesTableState],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows: Array<{ original: PaymentMadeTableRow }>) => {
      const selectedIds = selectedRows?.map((row) => row.original.id) || [];
      setPaymentMadesSelectedRows(selectedIds);
    },
    [setPaymentMadesSelectedRows],
  );

  if (isEmptyStatus) {
    return <PaymentMadesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={paymentMades ?? []}
        onFetchData={handleDataTableFetchData}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={paymentMadesSelectedRows}
        autoResetSelectedRows={false}
        loading={isPaymentsLoading}
        headerLoading={isPaymentsLoading}
        progressBarLoading={isPaymentsFetching}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        initialPageSize={paymentMadesTableState?.pageSize ?? 10}
        rowsCount={pagination?.total ?? 0}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={paymentMadesTableSize}
        payload={{
          onEdit: handleEditPaymentMade,
          onDelete: handleDeletePaymentMade,
          onViewDetails: handleViewDetailPaymentMade,
        }}
      />
    </DashboardContentTable>
  );
}

export const PaymentMadesTable = compose(
  withPaymentMadeActions,
  withPaymentMade(({ paymentMadesTableState, paymentMadesSelectedRows }) => ({
    paymentMadesTableState,
    paymentMadesSelectedRows,
  })),
  withAlertActions,
  withDrawerActions,
)(PaymentMadesTableInner);
