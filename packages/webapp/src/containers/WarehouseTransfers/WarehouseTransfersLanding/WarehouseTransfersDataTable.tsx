import React from 'react';
import { useHistory } from 'react-router-dom';
import { useWarehouseTransfersTableColumns, ActionsMenu } from './components';
import { WarehouseTransfersEmptyStatus } from './WarehouseTransfersEmptyStatus';
import { useWarehouseTranfersListContext } from './WarehouseTransfersListProvider';
import { withWarehouseTransfersActions } from './withWarehouseTransfersActions';
import type { WithWarehouseTransfersActionsProps } from './withWarehouseTransfersActions';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
  DashboardContentTable,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface WarehouseTransferRow {
  id: number;
}

interface DataTableFetchParams {
  pageSize: number;
  pageIndex: number;
  sortBy: { id: string; desc: boolean }[];
}

interface WarehouseTransfersDataTableInnerProps
  extends Pick<
      WithWarehouseTransfersActionsProps,
      'setWarehouseTransferTableState'
    >,
    Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDrawerActionsProps, 'openDrawer'>,
    Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Warehouse transfers datatable.
 */
function WarehouseTransfersDataTableInner({
  // #withWarehouseTransfersActions
  setWarehouseTransferTableState,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  openDrawer,
}: WarehouseTransfersDataTableInnerProps) {
  const history = useHistory();

  // Warehouse transfers list context.
  const {
    warehousesTransfers,
    pagination,
    isEmptyStatus,
    isWarehouseTransfersLoading,
    isWarehouseTransfersFetching,
    warehouseTransferSettings,
  } = useWarehouseTranfersListContext();
  const warehouseTransferTableSize = warehouseTransferSettings?.tableSize;

  // Invoices table columns.
  const columns = useWarehouseTransfersTableColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.WAREHOUSE_TRANSFERS);

  // Handles fetch data once the table state change.
  const handleDataTableFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }: DataTableFetchParams) => {
      setWarehouseTransferTableState({
        pageSize,
        pageIndex,
        sortBy,
      });
    },
    [setWarehouseTransferTableState],
  );

  // Display invoice empty status instead of the table.
  if (isEmptyStatus) {
    return <WarehouseTransfersEmptyStatus />;
  }

  // Handle view detail.
  const handleViewDetailWarehouseTransfer = ({ id }: WarehouseTransferRow) => {
    openDrawer(DRAWERS.WAREHOUSE_TRANSFER_DETAILS, { warehouseTransferId: id });
  };

  // Handle edit warehouse transfer.
  const handleEditWarehouseTransfer = ({ id }: WarehouseTransferRow) => {
    history.push(`/warehouses-transfers/${id}/edit`);
  };

  // Handle delete warehouse transfer.
  const handleDeleteWarehouseTransfer = ({ id }: WarehouseTransferRow) => {
    openAlert('warehouse-transfer-delete', { warehouseTransferId: id });
  };

  // Handle initiate warehouse transfer.
  const handleInitateWarehouseTransfer = ({ id }: WarehouseTransferRow) => {
    openAlert('warehouse-transfer-initate', { warehouseTransferId: id });
  };
  // Handle transferred warehouse transfer.
  const handleTransferredWarehouseTransfer = ({ id }: WarehouseTransferRow) => {
    openAlert('transferred-warehouse-transfer', { warehouseTransferId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell: {
    row: { original: WarehouseTransferRow };
  }) => {
    openDrawer(DRAWERS.WAREHOUSE_TRANSFER_DETAILS, {
      warehouseTransferId: cell.row.original.id,
    });
  };

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={warehousesTransfers ?? []}
        loading={isWarehouseTransfersLoading}
        headerLoading={isWarehouseTransfersLoading}
        progressBarLoading={isWarehouseTransfersFetching}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        manualPagination={true}
        rowsCount={pagination?.total ?? 0}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={warehouseTransferTableSize}
        payload={{
          onViewDetails: handleViewDetailWarehouseTransfer,
          onDelete: handleDeleteWarehouseTransfer,
          onEdit: handleEditWarehouseTransfer,
          onInitate: handleInitateWarehouseTransfer,
          onTransfer: handleTransferredWarehouseTransfer,
        }}
      />
    </DashboardContentTable>
  );
}
export const WarehouseTransfersDataTable = compose(
  withDashboardActions,
  withWarehouseTransfersActions,
  withAlertActions,
  withDrawerActions,
  withDialogActions,
)(WarehouseTransfersDataTableInner);
