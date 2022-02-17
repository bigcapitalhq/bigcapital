import React from 'react';

import { useWarehouses } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const InventoryItemDetailsHeaderDimensionsPanelContext = React.createContext();

/**
 * Inventory Item details header provider.
 * @returns
 */
function InventoryItemDetailsHeaderDimensionsProvider({ ...props }) {
  // Fetch warehouses list.
  const { data: warehouses, isLoading: isWarehouesLoading } = useWarehouses();

  // Provider
  const provider = {
    warehouses,
    isWarehouesLoading,
  };

  return isWarehouesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventoryItemDetailsHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventoryItemDetailsHeaderDimensionsPanelContext = () =>
  React.useContext(InventoryItemDetailsHeaderDimensionsPanelContext);

export {
  InventoryItemDetailsHeaderDimensionsProvider,
  useInventoryItemDetailsHeaderDimensionsPanelContext,
};
