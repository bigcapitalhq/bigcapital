import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';
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
    <DashboardInsider loading={isAdjustmentsLoading}>
      <DrawerHeaderContent
        name="inventory-adjustment-drawer"
        title={intl.get('inventory_adjustment.details_drawer.title')}
      />

      <InventoryAdjustmentDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useInventoryAdjustmentDrawerContext = () =>
  React.useContext(InventoryAdjustmentDrawerContext);

export {
  InventoryAdjustmentDrawerProvider,
  useInventoryAdjustmentDrawerContext,
};
