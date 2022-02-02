import React from 'react';
import { useHistory } from 'react-router-dom';

import WarehouseTransfersEmptyStatus from './WarehouseTransfersEmptyStatus';

import { DataTable, DashboardContentTable } from 'components';
import { TABLES } from 'common/tables';
import { useMemorizedColumnsWidths } from 'hooks';

import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withSettings from '../../Settings/withSettings';

import { useWarehouseTransfersTableColumns, ActionsMenu } from './components';
import { useWarehouseTranfersListContext } from './WarehouseTransfersListProvider';

import { compose } from 'utils';

/**
 * Warehouse transfers datatable.
 */
function WarehouseTransfersDataTable({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,
}) {
  const history = useHistory();

  // Warehouse transfers list context.
  const { isEmptyStatus } = useWarehouseTranfersListContext();

  // Invoices table columns.
  const columns = useWarehouseTransfersTableColumns();

  // Handle view detail.
  const handleViewDetailWarehouseTransfer = ({ id }) => {
    openDrawer('warehouse-transfer-detail-drawer', { warehouseTransferId: id });
  };

  // Handle edit warehouse transfer.
  const handleEditWarehouseTransfer = ({ id }) => {
    history.push(`/warehouses-transfers/${id}/edit`);
  };

  // Handle delete warehouse transfer.
  const handleDeleteWarehouseTransfer = ({ id }) => {
    openAlert('warehouse-transfer-delete', { warehouseTransferId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('warehouse-transfer-detail-drawer', {
      warehouseTransferId: cell.row.original.id,
    });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.WAREHOUSETRANSFERS);

  // Handles fetch data once the table state change.
  const handleDataTableFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {},
    [],
  );

  // Display invoice empty status instead of the table.
  if (isEmptyStatus) {
    return <WarehouseTransfersEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={[]}
        // loading={}
        // headerLoading={}
        // progressBarLoading={}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        // size={invoicesTableSize}
        payload={{
          onViewDetails: handleViewDetailWarehouseTransfer,
          onDelete: handleDeleteWarehouseTransfer,
          onEdit: handleEditWarehouseTransfer,
        }}
      />
    </DashboardContentTable>
  );
}
export default compose(
  withDashboardActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
)(WarehouseTransfersDataTable);
