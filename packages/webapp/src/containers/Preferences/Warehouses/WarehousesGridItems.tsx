import { Intent } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import React from 'react';
import intl from 'react-intl-universal';
import { WarehouseContextMenu, WarehousesGridItemBox } from './components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { Warehouse } from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useMarkWarehouseAsPrimary } from '@/hooks/query';
import { compose } from '@/utils';

interface WarehouseGridItemProps
  extends WithAlertActionsProps,
    WithDialogActionsProps {
  warehouse: Warehouse;
}

function WarehouseGridItem({
  openAlert,
  openDialog,
  warehouse,
}: WarehouseGridItemProps): React.ReactElement {
  const { mutateAsync: markWarehouseAsPrimaryMutate } =
    useMarkWarehouseAsPrimary();

  const handleEditWarehouse = () => {
    openDialog('warehouse-form', {
      warehouseId: warehouse.id,
      action: 'edit',
    });
  };
  const handleDeleteWarehouse = () => {
    openAlert('warehouse-delete', { warehouseId: warehouse.id });
  };
  const handleMarkWarehouseAsPrimary = () => {
    markWarehouseAsPrimaryMutate(warehouse.id).then(() => {
      AppToaster.show({
        message: intl.get('warehouse.alert.mark_primary_message'),
        intent: Intent.SUCCESS,
      });
    });
  };

  return (
    <ContextMenu2
      content={
        <WarehouseContextMenu
          warehouse={warehouse}
          onEditClick={handleEditWarehouse}
          onDeleteClick={handleDeleteWarehouse}
          onMarkPrimary={handleMarkWarehouseAsPrimary}
        />
      }
    >
      <WarehousesGridItemBox
        title={warehouse.name}
        code={warehouse.code}
        city={warehouse.city}
        country={warehouse.country}
        primary={warehouse.primary}
      />
    </ContextMenu2>
  );
}

const WarehousesGridItem = compose(
  withAlertActions,
  withDialogActions,
)(WarehouseGridItem);

interface WarehousesGridItemsProps {
  warehouses: Warehouse[];
}

export function WarehousesGridItems({
  warehouses,
}: WarehousesGridItemsProps): React.ReactElement {
  return (
    <>
      {warehouses.map((warehouse) => (
        <WarehousesGridItem key={warehouse.id} warehouse={warehouse} />
      ))}
    </>
  );
}
