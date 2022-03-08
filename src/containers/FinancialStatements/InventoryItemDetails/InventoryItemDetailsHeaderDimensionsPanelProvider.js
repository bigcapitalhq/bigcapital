import React from 'react';

import { Features } from 'common';
import { useWarehouses } from 'hooks/query';
import { useFeatureCan } from 'hooks/state';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const InventoryItemDetailsHeaderDimensionsPanelContext = React.createContext();

/**
 * Inventory Item details header provider.
 * @returns
 */
function InventoryItemDetailsHeaderDimensionsProvider({ query, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Fetch warehouses list.
  const { data: warehouses, isLoading: isWarehouesLoading } = useWarehouses(
    query,
    { enabled: isWarehouseFeatureCan },
  );

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
