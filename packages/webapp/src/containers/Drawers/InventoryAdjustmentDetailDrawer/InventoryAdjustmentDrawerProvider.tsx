import React from 'react';
import intl from 'react-intl-universal';
import type { InventoryAdjustment } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useInventoryAdjustment } from '@/hooks/query';

export interface InventoryAdjustmentDrawerContextValue {
  inventoryId: number | undefined;
  inventoryAdjustment: InventoryAdjustment | undefined;
  isInventoryAdjustmentLoading: boolean;
  isInventoryAdjustmentFetching: boolean;
}

interface InventoryAdjustmentDrawerProviderProps {
  inventoryId: number | undefined;
}

const InventoryAdjustmentDrawerContext = React.createContext<
  InventoryAdjustmentDrawerContextValue | undefined
>(undefined);

/**
 * Inventory adjustment drawer provider.
 */
function InventoryAdjustmentDrawerProvider({
  inventoryId,
  ...props
}: InventoryAdjustmentDrawerProviderProps & { children?: React.ReactNode }) {
  const {
    data: inventoryAdjustment,
    isLoading: isInventoryAdjustmentLoading,
    isFetching: isInventoryAdjustmentFetching,
  } = useInventoryAdjustment(inventoryId, {
    enabled: !!inventoryId,
  });

  const provider: InventoryAdjustmentDrawerContextValue = {
    inventoryId,
    inventoryAdjustment,
    isInventoryAdjustmentLoading,
    isInventoryAdjustmentFetching,
  };

  return (
    <DrawerLoading loading={isInventoryAdjustmentLoading}>
      <DrawerHeaderContent
        name={DRAWERS.INVENTORY_ADJUSTMENT_DETAILS}
        title={intl.get('inventory_adjustment.details_drawer.title')}
      />
      <InventoryAdjustmentDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useInventoryAdjustmentDrawerContext =
  (): InventoryAdjustmentDrawerContextValue => {
    const ctx = React.useContext(InventoryAdjustmentDrawerContext);
    if (ctx === undefined) {
      throw new Error(
        'useInventoryAdjustmentDrawerContext must be used within an InventoryAdjustmentDrawerProvider',
      );
    }
    return ctx;
  };

export {
  InventoryAdjustmentDrawerProvider,
  useInventoryAdjustmentDrawerContext,
};
