// @ts-nocheck
import React from 'react';

import { useWarehouses, useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';

const InventoryItemDetailsHeaderDimensionsPanelContext = React.createContext();

/**
 * Inventory Item details header provider.
 * @returns
 */
function InventoryItemDetailsHeaderDimensionsProvider({ ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Determines whether the warehouses feature is accessible.
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Determines whether the branches feature is accessible.
  const isBranchesFeatureCan = featureCan(Features.Branches);

  // Fetches the warehouses list.
  const { data: warehouses, isLoading: isWarehousesLoading } = useWarehouses(
    null,
    { enabled: isWarehouseFeatureCan },
  );

  // Fetches the branches list.
  const { data: branches, isLoading: isBranchesLoading } = useBranches(null, {
    enabled: isBranchesFeatureCan,
  });

  // Provider
  const provider = {
    warehouses,
    branches,
    isWarehousesLoading,
    isBranchesLoading,
  };

  return isWarehousesLoading || isBranchesLoading ? (
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
