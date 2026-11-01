import {
  BranchesListResponse,
  WarehousesListResponse,
} from '@bigcapital/sdk-ts';
import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useWarehouses, useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

interface InventoryValuationHeaderDimensionsPanelContextValue {
  warehouses: WarehousesListResponse | undefined;
  branches: BranchesListResponse | undefined;
  isWarehouesLoading: boolean;
  isBranchLoading: boolean;
}

interface InventoryValuationHeaderDimensionsProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const InventoryValuationHeaderDimensionsPanelContext = createContext<
  InventoryValuationHeaderDimensionsPanelContextValue | undefined
>(undefined);

/**
 * Inventory valuation header provider.
 */
function InventoryValuationHeaderDimensionsProvider({
  ...props
}: InventoryValuationHeaderDimensionsProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Detarmines whether the warehouses feature is accessible.
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Detarmines whether the branches feature is accessible.
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the warehouses list.
  const { data: warehouses, isLoading: isWarehouesLoading } = useWarehouses(
    {},
    { enabled: isWarehouseFeatureCan },
  );
  // Fetches the branches list.
  const { data: branches, isLoading: isBranchLoading } = useBranches(
    {},
    {
      enabled: isBranchFeatureCan,
    },
  );

  // Provider
  const provider: InventoryValuationHeaderDimensionsPanelContextValue = {
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

const useInventoryValuationHeaderDimensionsPanelContext =
  (): InventoryValuationHeaderDimensionsPanelContextValue => {
    const ctx = useContext(InventoryValuationHeaderDimensionsPanelContext);
    if (!ctx) {
      throw new Error(
        'useInventoryValuationHeaderDimensionsPanelContext must be used within InventoryValuationHeaderDimensionsProvider',
      );
    }
    return ctx;
  };

export {
  InventoryValuationHeaderDimensionsProvider,
  useInventoryValuationHeaderDimensionsPanelContext,
};
