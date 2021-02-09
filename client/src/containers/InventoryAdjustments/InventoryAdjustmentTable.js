import React, { useCallback } from 'react';

import classNames from 'classnames';

import { DataTable } from 'components';
import { CLASSES } from 'common/classes';
import { useInventoryAdjustmentsColumns, ActionsMenu } from './components';

import withAlertsActions from 'containers/Alert/withAlertActions';
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

  // #ownProps
  tableProps
}) {
  const {
    isAdjustmentsLoading,
    isAdjustmentsFetching,

    inventoryAdjustments,
    pagination
  } = useInventoryAdjustmentsContext();

  // Handle delete inventory adjustment transaction.
  const handleDeleteAdjustment = ({ id }) => {
    openAlert('inventory-adjustment-delete', { inventoryId: id });
  };

  // Inventory adjustments columns.
  const columns = useInventoryAdjustmentsColumns();

  // Handle the table fetch data once states changing.
  const handleDataTableFetchData = useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setInventoryAdjustmentTableState({
        pageSize,
        pageIndex,
        sortBy
      })
    },
    [setInventoryAdjustmentTableState],
  );

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
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

        payload={{
          onDelete: handleDeleteAdjustment,
        }}
        ContextMenu={ActionsMenu}
        noResults={'There is no inventory adjustments transactions yet.'}
        {...tableProps}
      />
    </div>
  );
}

export default compose(
  withAlertsActions,
  withInventoryAdjustmentActions,
  withInventoryAdjustments(({ inventoryAdjustmentTableState }) => ({
    inventoryAdjustmentTableState,
  })),
)(InventoryAdjustmentDataTable);
