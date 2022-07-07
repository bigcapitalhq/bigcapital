import React from 'react';

import { Features } from '@/common';
import { useFeatureCan } from '@/hooks/state';
import { useWarehouses, useBranches } from '@/hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const InventoryValuationHeaderDimensionsPanelContext = React.createContext();

/**
 * Inventory valuation header provider.
 * @returns
 */
function InventoryValuationHeaderDimensionsProvider({ ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Detarmines whether the warehouses feature is accessiable.
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Detarmines whether the branches feature is accessiable.
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the warehouses list.
  const { data: warehouses, isLoading: isWarehouesLoading } = useWarehouses(
    null,
    { enabled: isWarehouseFeatureCan, keepPreviousData: true },
  );

  // Fetches the branches list.
  const { data: branches, isLoading: isBranchLoading } = useBranches(null, {
    enabled: isBranchFeatureCan,
    keepPreviousData: true,
  });

  // Provider
  const provider = {
    warehouses,
    branches,
    isWarehouesLoading,
    isBranchLoading,
  };

  return isWarehouesLoading || isBranchLoading ? (
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
