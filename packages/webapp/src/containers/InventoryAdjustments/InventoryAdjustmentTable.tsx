import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { useInventoryAdjustmentsColumns, ActionsMenu } from './components';
import { useInventoryAdjustmentsContext } from './InventoryAdjustmentsProvider';
import { withInventoryAdjustmentActions } from './withInventoryAdjustmentActions';
import { withInventoryAdjustments } from './withInventoryAdjustments';
import type { WithInventoryAdjustmentActionsProps } from './withInventoryAdjustmentActions';
import type { WithInventoryAdjustmentsProps } from './withInventoryAdjustments';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { InventoryAdjustment } from '@bigcapital/sdk-ts';
import { DataTable } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface InventoryAdjustmentDataTableProps
  extends Pick<WithInventoryAdjustmentsProps, 'inventoryAdjustmentTableState'>,
    WithInventoryAdjustmentActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {
  tableProps?: Record<string, unknown>;
}

/**
 * Inventory adjustments datatable.
 */
function InventoryAdjustmentDataTable({
  // #withInventoryAdjustmentsActions
  setInventoryAdjustmentTableState,

  // #withInventoryAdjustments
  inventoryAdjustmentTableState,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #ownProps
  tableProps,
}: InventoryAdjustmentDataTableProps) {
  const {
    isAdjustmentsLoading,
    isAdjustmentsFetching,

    inventoryAdjustments,
    pagination,
  } = useInventoryAdjustmentsContext();

  // Handle delete inventory adjustment transaction.
  const handleDeleteAdjustment = ({ id }: InventoryAdjustment) => {
    openAlert('inventory-adjustment-delete', { inventoryId: id });
  };

  // Handle the inventory adjustment publish action.
  const handlePublishInventoryAdjustment = ({ id }: InventoryAdjustment) => {
    openAlert('inventory-adjustment-publish', { inventoryId: id });
  };
  // Handle view detail inventory adjustment.
  const handleViewDetailInventoryAdjustment = ({ id }: InventoryAdjustment) => {
    openDrawer(DRAWERS.INVENTORY_ADJUSTMENT_DETAILS, { inventoryId: id });
  };

  // Inventory adjustments columns.
  const columns = useInventoryAdjustmentsColumns();

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.INVENTORY_ADJUSTMENTS);

  // Handle the table fetch data once states changing.
  const handleDataTableFetchData = useCallback(
    ({
      pageSize,
      pageIndex,
      sortBy,
    }: {
      pageSize: number;
      pageIndex: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setInventoryAdjustmentTableState({
        pageSize,
        pageIndex,
        sortBy,
      });
    },
    [setInventoryAdjustmentTableState],
  );
  // Handle cell click.
  const handleCellClick = (
    cell: { row: { original: InventoryAdjustment } },
    _event: React.MouseEvent,
  ) => {
    openDrawer(DRAWERS.INVENTORY_ADJUSTMENT_DETAILS, {
      inventoryId: cell.row.original.id,
    });
  };
  return (
    <DataTable
      columns={columns}
      data={inventoryAdjustments ?? []}
      loading={isAdjustmentsLoading}
      headerLoading={isAdjustmentsLoading}
      progressBarLoading={isAdjustmentsFetching}
      noInitialFetch={true}
      onFetchData={handleDataTableFetchData}
      manualSortBy={true}
      selectionColumn={true}
      pagination={true}
      initialPageSize={inventoryAdjustmentTableState?.pageSize ?? 10}
      rowsCount={pagination?.total ?? 0}
      autoResetSortBy={false}
      autoResetPage={false}
      onCellClick={handleCellClick}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      payload={{
        onDelete: handleDeleteAdjustment,
        onPublish: handlePublishInventoryAdjustment,
        onViewDetails: handleViewDetailInventoryAdjustment,
      }}
      ContextMenu={ActionsMenu}
      noResults={intl.get('there_is_no_inventory_adjustments_transactions_yet')}
      {...tableProps}
    />
  );
}

export const InventoryAdjustmentTable = compose(
  withAlertActions,
  withInventoryAdjustmentActions,
  withDrawerActions,
  withInventoryAdjustments(({ inventoryAdjustmentTableState }) => ({
    inventoryAdjustmentTableState,
  })),
)(InventoryAdjustmentDataTable);
