import React, { createContext } from 'react';
import type {
  GetInventoryAdjustmentsQuery,
  InventoryAdjustment,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import { useInventoryAdjustments } from '@/hooks/query';

interface InventoryAdjustmentsProviderProps {
  query?: GetInventoryAdjustmentsQuery | null;
  children?: React.ReactNode;
}

export interface InventoryAdjustmentsContextValue {
  inventoryAdjustments: InventoryAdjustment[] | undefined;
  pagination: { total?: number; [key: string]: unknown } | undefined;
  isAdjustmentsLoading: boolean;
  isAdjustmentsFetching: boolean;
}

const InventoryAdjustmentsContext =
  createContext<InventoryAdjustmentsContextValue>(
    {} as InventoryAdjustmentsContextValue,
  );

/**
 * Accounts chart data provider.
 */
function InventoryAdjustmentsProvider({
  query,
  ...props
}: InventoryAdjustmentsProviderProps) {
  // Handles the inventory adjustments fethcing of the given query.
  const {
    isLoading: isAdjustmentsLoading,
    isFetching: isAdjustmentsFetching,
    data: inventoryAdjustmentsData,
  } = useInventoryAdjustments(query);

  // Provider payload.
  const provider: InventoryAdjustmentsContextValue = {
    inventoryAdjustments: inventoryAdjustmentsData?.data,
    isAdjustmentsLoading,
    isAdjustmentsFetching,
    pagination: inventoryAdjustmentsData?.pagination,
  };

  return (
    <DashboardInsider
      loading={isAdjustmentsLoading}
      name={'inventory_adjustments'}
    >
      <InventoryAdjustmentsContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useInventoryAdjustmentsContext = () =>
  React.useContext(InventoryAdjustmentsContext);

export { InventoryAdjustmentsProvider, useInventoryAdjustmentsContext };
