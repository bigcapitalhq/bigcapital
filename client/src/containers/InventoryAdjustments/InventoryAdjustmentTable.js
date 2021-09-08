import React, { useCallback } from 'react';
import { DataTable } from 'components';
import { useInventoryAdjustmentsColumns, ActionsMenu } from './components';
import intl from 'react-intl-universal';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withInventoryAdjustmentActions from './withInventoryAdjustmentActions';

import { useInventoryAdjustmentsContext } from './InventoryAdjustmentsProvider';
import withInventoryAdjustments from './withInventoryAdjustments';
import { compose } from 'utils';

/**
 * Inventory adjustments datatable.
 */
function InventoryAdjustmentDataTable({
  // #withInventoryAdjustmentsActions
  setInventoryAdjustmentTableState,

  // #withInventoryAdjustments
  inventoryAdjustmentTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #ownProps
  tableProps,
}) {
  const {
    isAdjustmentsLoading,
    isAdjustmentsFetching,

    inventoryAdjustments,
    pagination,
  } = useInventoryAdjustmentsContext();

  // Handle delete inventory adjustment transaction.
  const handleDeleteAdjustment = ({ id }) => {
    openAlert('inventory-adjustment-delete', { inventoryId: id });
  };

  // Handle the inventory adjustment publish action.
  const handlePublishInventoryAdjustment = ({ id }) => {
    openAlert('inventory-adjustment-publish', { inventoryId: id });
  };
  // Handle view detail inventory adjustment.
  const handleViewDetailInventoryAdjustment = ({ id }) => {
    openDrawer('inventory-adjustment-drawer', { inventoryId: id });
  };

  // Inventory adjustments columns.
  const columns = useInventoryAdjustmentsColumns();

  // Handle the table fetch data once states changing.
  const handleDataTableFetchData = useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setInventoryAdjustmentTableState({
        pageSize,
        pageIndex,
        sortBy,
      });
    },
    [setInventoryAdjustmentTableState],
  );
  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('inventory-adjustment-drawer', {
      inventoryId: cell.row.original.id,
    });
  };
  return (
    <DataTable
      columns={columns}
      data={inventoryAdjustments}
      loading={isAdjustmentsLoading}
      headerLoading={isAdjustmentsLoading}
      progressBarLoading={isAdjustmentsFetching}
      initialState={inventoryAdjustmentTableState}
      noInitialFetch={true}
      onFetchData={handleDataTableFetchData}
      manualSortBy={true}
      selectionColumn={true}
      pagination={true}
      pagesCount={pagination.pagesCount}
      autoResetSortBy={false}
      autoResetPage={false}
      onCellClick={handleCellClick}
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

export default compose(
  withAlertsActions,
  withInventoryAdjustmentActions,
  withDrawerActions,
  withInventoryAdjustments(({ inventoryAdjustmentTableState }) => ({
    inventoryAdjustmentTableState,
  })),
)(InventoryAdjustmentDataTable);
