// @ts-nocheck
import React, { createContext } from 'react';
import { DashboardInsider } from '@/components/Dashboard';
import { useInventoryAdjustments } from '@/hooks/query';

const InventoryAdjustmentsContext = createContext();

/**
 * Accounts chart data provider.
 */
function InventoryAdjustmentsProvider({ query, ...props }) {
  // Handles the inventory adjustments fethcing of the given query.
  const {
    isLoading: isAdjustmentsLoading,
    isFetching: isAdjustmentsFetching,
    data: inventoryAdjustmentsData,
  } = useInventoryAdjustments(query, {
    placeholderData: (previousData) => previousData,
  });

  // Provider payload.
  const provider = {
    inventoryAdjustments: inventoryAdjustmentsData?.inventoryAdjustments,
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
