import React from 'react';

import { useWarehouses } from 'hooks/query';
import { Features } from 'common';
import { useFeatureCan } from 'hooks/state';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const InventoryValuationHeaderDimensionsPanelContext = React.createContext();

/**
 * Inventory valuation header provider.
 * @returns
 */
function InventoryValuationHeaderDimensionsProvider({ query, ...props }) {
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
