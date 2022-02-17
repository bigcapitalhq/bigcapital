import React from 'react';

import { useWarehouses } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const InventoryValuationHeaderDimensionsPanelContext = React.createContext();

/**
 * Inventory valuation header provider.
 * @returns
 */
function InventoryValuationHeaderDimensionsProvider({ ...props }) {
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
    <InventoryValuationHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventoryValuationHeaderDimensionsPanelContext = () =>
  React.useContext(InventoryValuationHeaderDimensionsPanelContext);

export {
  InventoryValuationHeaderDimensionsProvider,
  useInventoryValuationHeaderDimensionsPanelContext,
};
