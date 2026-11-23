import {
  BranchesListResponse,
  WarehousesListResponse,
} from '@bigcapital/sdk-ts';
import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useWarehouses, useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

interface InventorySummaryHeaderDimensionsPanelContextValue {
  warehouses: WarehousesListResponse | undefined;
  branches: BranchesListResponse | undefined;
  isWarehouesLoading: boolean;
  isBranchLoading: boolean;
}

interface InventorySummaryHeaderDimensionsProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const InventorySummaryHeaderDimensionsPanelContext = createContext<
  InventorySummaryHeaderDimensionsPanelContextValue | undefined
>(undefined);

/**
 * Inventory summary header dimensions provider.
 */
function InventorySummaryHeaderDimensionsProvider({
  ...props
}: InventorySummaryHeaderDimensionsProviderProps) {
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
  const provider: InventorySummaryHeaderDimensionsPanelContextValue = {
    warehouses,
    branches,
    isWarehouesLoading,
    isBranchLoading,
  };

  return isWarehouesLoading || isBranchLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventorySummaryHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventorySummaryHeaderDimensionsPanelContext =
  (): InventorySummaryHeaderDimensionsPanelContextValue => {
    const ctx = useContext(InventorySummaryHeaderDimensionsPanelContext);
    if (!ctx) {
      throw new Error(
        'useInventorySummaryHeaderDimensionsPanelContext must be used within InventorySummaryHeaderDimensionsProvider',
      );
    }
    return ctx;
  };

export {
  InventorySummaryHeaderDimensionsProvider,
  useInventorySummaryHeaderDimensionsPanelContext,
};
