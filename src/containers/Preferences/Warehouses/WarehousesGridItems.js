import React from 'react';
import styled from 'styled-components';
import { ContextMenu2 } from '@blueprintjs/popover2';

import { WarehouseContextMenu, WarehousesGrid } from './components';

import withAlertsActions from '../../Alert/withAlertActions';
import withDialogActions from '../../Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * Warehouse grid items.
 * @returns
 */
function WarehousesGridItems({
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

  return (
    <ContextMenu2
      content={
        <WarehouseContextMenu
          onEditClick={handleEditWarehouse}
          onDeleteClick={handleDeleteWarehouse}
        />
      }
    >
      <WarehousesGrid warehouse={warehouse} />
    </ContextMenu2>
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
)(WarehousesGridItems);

const WarehouseGridWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px;
`;
