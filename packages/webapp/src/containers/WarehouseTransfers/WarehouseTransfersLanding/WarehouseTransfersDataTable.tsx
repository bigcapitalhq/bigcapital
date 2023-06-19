// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
  DashboardContentTable,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useWarehouseTransfersTableColumns, ActionsMenu } from './components';
import { useWarehouseTranfersListContext } from './WarehouseTransfersListProvider';

import WarehouseTransfersEmptyStatus from './WarehouseTransfersEmptyStatus';
import withWarehouseTransfersActions from './withWarehouseTransfersActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withSettings from '@/containers/Settings/withSettings';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Warehouse transfers datatable.
 */
function WarehouseTransfersDataTable({
  // #withWarehouseTransfersActions
  setWarehouseTransferTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,

  // #withSettings
  warehouseTransferTableSize,
}) {
  const history = useHistory();

  // Warehouse transfers list context.
  const {
    warehousesTransfers,
    pagination,
    isEmptyStatus,
    isWarehouseTransfersLoading,
    isWarehouseTransfersFetching,
  } = useWarehouseTranfersListContext();

  // Invoices table columns.
  const columns = useWarehouseTransfersTableColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.WAREHOUSE_TRANSFERS);

  // Handles fetch data once the table state change.
  const handleDataTableFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
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
  const handleViewDetailWarehouseTransfer = ({ id }) => {
    openDrawer(DRAWERS.WAREHOUSE_TRANSFER_DETAILS, { warehouseTransferId: id });
  };

  // Handle edit warehouse transfer.
  const handleEditWarehouseTransfer = ({ id }) => {
    history.push(`/warehouses-transfers/${id}/edit`);
  };

  // Handle delete warehouse transfer.
  const handleDeleteWarehouseTransfer = ({ id }) => {
    openAlert('warehouse-transfer-delete', { warehouseTransferId: id });
  };

  // Handle initiate warehouse transfer.
  const handleInitiateWarehouseTransfer = ({ id }) => {
    openAlert('warehouse-transfer-initiate', { warehouseTransferId: id });
  };
  // Handle transferred warehouse transfer.
  const handleTransferredWarehouseTransfer = ({ id }) => {
    openAlert('transferred-warehouse-transfer', { warehouseTransferId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.WAREHOUSE_TRANSFER_DETAILS, {
      warehouseTransferId: cell.row.original.id,
    });
  };

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={warehousesTransfers}
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
        pagesCount={pagination.pagesCount}
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
          onInitiate: handleInitiateWarehouseTransfer,
          onTransfer: handleTransferredWarehouseTransfer,
        }}
      />
    </DashboardContentTable>
  );
}
export default compose(
  withDashboardActions,
  withWarehouseTransfersActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
  withSettings(({ warehouseTransferSettings }) => ({
    warehouseTransferTableSize: warehouseTransferSettings?.tableSize,
  })),
)(WarehouseTransfersDataTable);
