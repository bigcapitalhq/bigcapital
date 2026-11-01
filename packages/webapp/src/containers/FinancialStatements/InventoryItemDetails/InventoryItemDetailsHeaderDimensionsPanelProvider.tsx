import {
  BranchesListResponse,
  WarehousesListResponse,
} from '@bigcapital/sdk-ts';
import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useWarehouses, useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

interface InventoryItemDetailsHeaderDimensionsPanelContextValue {
  warehouses: WarehousesListResponse | undefined;
  branches: BranchesListResponse | undefined;
  isWarehouesLoading: boolean;
  isBranchesLoading: boolean;
}

interface InventoryItemDetailsHeaderDimensionsProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const InventoryItemDetailsHeaderDimensionsPanelContext = createContext<
  InventoryItemDetailsHeaderDimensionsPanelContextValue | undefined
>(undefined);

/**
 * Inventory Item details header provider.
 * @returns
 */
function InventoryItemDetailsHeaderDimensionsProvider({
  ...props
}: InventoryItemDetailsHeaderDimensionsProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Detarmines whether the warehouses feature is accessible.
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Detarmines whether the branches feature is accessible.
  const isBranchesFeatureCan = featureCan(Features.Branches);

  // Fetches the warehouses list.
  const { data: warehouses, isLoading: isWarehouesLoading } = useWarehouses(
    {},
    { enabled: isWarehouseFeatureCan },
  );

  // Fetches the branches list.
  const { data: branches, isLoading: isBranchesLoading } = useBranches(
    {},
    {
      enabled: isBranchesFeatureCan,
    },
  );

  // Provider
  const provider: InventoryItemDetailsHeaderDimensionsPanelContextValue = {
    warehouses,
    branches,
    isWarehouesLoading,
    isBranchesLoading,
  };

  return isWarehouesLoading || isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventoryItemDetailsHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventoryItemDetailsHeaderDimensionsPanelContext =
  (): InventoryItemDetailsHeaderDimensionsPanelContextValue => {
    const ctx = useContext(InventoryItemDetailsHeaderDimensionsPanelContext);
    if (!ctx) {
      throw new Error(
        'useInventoryItemDetailsHeaderDimensionsPanelContext must be used within InventoryItemDetailsHeaderDimensionsProvider',
      );
    }
    return ctx;
  };

export {
  InventoryItemDetailsHeaderDimensionsProvider,
  useInventoryItemDetailsHeaderDimensionsPanelContext,
};
