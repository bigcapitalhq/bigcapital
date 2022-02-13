import React from 'react';
import { ContextMenu2 } from '@blueprintjs/popover2';

import { WarehouseContextMenu, WarehousesGrid } from './components';
import { useWarehousesContext } from './WarehousesProvider';

import withAlertsActions from '../../Alert/withAlertActions';
import withDialogActions from '../../Dialog/withDialogActions';
import { compose } from 'utils';

/**
 *  warehouse grid item.
 */
function WarehouseGridItem({
  // #withAlertsActions
  openAlert,
  // #withDialogActions
  openDialog,

  warehouse,
}) {
  // Handle edit warehouse.
  const handleEditWarehouse = () => {
    openDialog('warehouse-form', { warehouseId: warehouse.id, action: 'edit' });
  };

  // Handle delete warehouse.
  const handleDeleteWarehouse = () => {
    openAlert('warehouse-delete', { warehouseId: warehouse.id });
  };

  // Handle mark primary warehouse.
  const handleMarkPrimaryWarehouse = () => {
    openAlert('warehouse-mark-primary', { warehouseId: warehouse.id });
  };

  return (
    <ContextMenu2
      content={
        <WarehouseContextMenu
          onEditClick={handleEditWarehouse}
          onDeleteClick={handleDeleteWarehouse}
          onMarkPrimary={handleMarkPrimaryWarehouse}
        />
      }
    >
      <WarehousesGrid
        title={warehouse.name}
        code={warehouse.code}
        city={warehouse.city}
        country={warehouse.country}
        email={warehouse.email}
        phone={warehouse.phone_number}
      />
    </ContextMenu2>
  );
}

const WarehousesGridItem = compose(
  withAlertsActions,
  withDialogActions,
)(WarehouseGridItem);

/**
 * warehouses grid items,
 */
export default function WarehousesGridItems({ warehouses }) {
  return warehouses.map((warehouse) => (
    <WarehousesGridItem warehouse={warehouse} />
  ));
}
