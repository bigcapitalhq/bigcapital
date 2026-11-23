import * as FF from 'fp-ts/function';
import { useState } from 'react';
import intl from 'react-intl-universal';
import { useInventoryAdjustmentsColumns, ActionsMenu } from './components';
import { useInventoryAdjustmentsContext } from './InventoryAdjustmentsProvider';
import { withInventoryAdjustmentActions } from './withInventoryAdjustmentActions';
import { withInventoryAdjustments } from './withInventoryAdjustments';
import type { WithInventoryAdjustmentActionsProps } from './withInventoryAdjustmentActions';
import type { WithInventoryAdjustmentsProps } from './withInventoryAdjustments';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { InventoryAdjustment } from '@bigcapital/sdk-ts';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.INVENTORY_ADJUSTMENTS,
  rowName: 'inventory-adjustment',
  identifierColumn: 'reference_no',
  ActionsMenu,
});

interface InventoryAdjustmentDataTableProps
  extends Pick<WithInventoryAdjustmentsProps, 'inventoryAdjustmentTableState'>,
    WithInventoryAdjustmentActionsProps,
    WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {}

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

  // #withDialogActions
  openDialog,

  // #withDrawerActions
  openDrawer,
}: InventoryAdjustmentDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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

  // Handle edit inventory adjustment transaction.
  const handleEditAdjustment = ({ id }: InventoryAdjustment) => {
    openDialog(DialogsName.InventoryAdjustmentForm, {
      action: 'edit',
      inventoryId: id,
    });
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

  return (
    <Table
      columns={columns}
      data={inventoryAdjustments}
      total={pagination?.total}
      loading={isAdjustmentsLoading}
      fetching={isAdjustmentsFetching}
      compact={false}
      query={inventoryAdjustmentTableState}
      setQuery={setInventoryAdjustmentTableState}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      emptyMessage={intl.get(
        'there_is_no_inventory_adjustments_transactions_yet',
      )}
      actions={{
        onDelete: handleDeleteAdjustment,
        onEdit: handleEditAdjustment,
        onPublish: handlePublishInventoryAdjustment,
        onViewDetails: handleViewDetailInventoryAdjustment,
      }}
    />
  );
}

export const InventoryAdjustmentTable = FF.pipe(
  InventoryAdjustmentDataTable,
  withInventoryAdjustments(({ inventoryAdjustmentTableState }) => ({
    inventoryAdjustmentTableState,
  })),
  withDrawerActions,
  withDialogActions,
  withInventoryAdjustmentActions,
  withAlertActions,
);
