import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import { useInventoryAdjustment } from 'hooks/query';

const InventoryAdjustmentDrawerContext = React.createContext();

/**
 * Inventory adjustment drawer provider.
 */
function InventoryAdjustmentDrawerProvider({ inventoryId, ...props }) {
  // Handle fetch inventory adjustment .
  const { data: inventoryAdjustment, isLoading: isAdjustmentsLoading } =
    useInventoryAdjustment(inventoryId, {
      enabled: !!inventoryId,
    });

  //provider.
  const provider = {
    inventoryAdjustment,
    inventoryId,
  };

  return (
    <DrawerLoading loading={isAdjustmentsLoading}>
      <DrawerHeaderContent
        name="inventory-adjustment-drawer"
        title={intl.get('inventory_adjustment.details_drawer.title')}
      />
      <InventoryAdjustmentDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useInventoryAdjustmentDrawerContext = () =>
  React.useContext(InventoryAdjustmentDrawerContext);

export {
  InventoryAdjustmentDrawerProvider,
  useInventoryAdjustmentDrawerContext,
};
