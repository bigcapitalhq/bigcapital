import {
  BranchesListResponse,
  WarehousesListResponse,
} from '@bigcapital/sdk-ts';
import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useBranches, useWarehouses } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

interface InventoryTurnoverByAmountDimensionsPanelContextValue {
  warehouses: WarehousesListResponse | undefined;
  branches: BranchesListResponse | undefined;
  isWarehouesLoading: boolean;
  isBranchesLoading: boolean;
}

interface InventoryTurnoverByAmountDimensionsPanelProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const InventoryTurnoverByAmountDimensionsPanelContext = createContext<
  InventoryTurnoverByAmountDimensionsPanelContextValue | undefined
>(undefined);

/**
 * Inventory turnover by amount header dimensions panel provider.
 */
function InventoryTurnoverByAmountDimensionsPanelProvider({
  ...props
}: InventoryTurnoverByAmountDimensionsPanelProviderProps) {
  const { featureCan } = useFeatureCan();

  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchesFeatureCan = featureCan(Features.Branches);

  const { data: warehouses, isLoading: isWarehouesLoading } = useWarehouses(
    {},
    { enabled: isWarehouseFeatureCan },
  );
  const { data: branches, isLoading: isBranchesLoading } = useBranches(
    {},
    { enabled: isBranchesFeatureCan },
  );

  const provider: InventoryTurnoverByAmountDimensionsPanelContextValue = {
    warehouses,
    branches,
    isWarehouesLoading,
    isBranchesLoading,
  };

  return isWarehouesLoading || isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventoryTurnoverByAmountDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventoryTurnoverByAmountDimensionsPanelContext =
  (): InventoryTurnoverByAmountDimensionsPanelContextValue => {
    const ctx = useContext(InventoryTurnoverByAmountDimensionsPanelContext);
    if (!ctx) {
      throw new Error(
        'useInventoryTurnoverByAmountDimensionsPanelContext must be used within InventoryTurnoverByAmountDimensionsPanelProvider',
      );
    }
    return ctx;
  };

export {
  InventoryTurnoverByAmountDimensionsPanelProvider,
  useInventoryTurnoverByAmountDimensionsPanelContext,
};
