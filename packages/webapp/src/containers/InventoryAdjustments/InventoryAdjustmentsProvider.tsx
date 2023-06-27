// @ts-nocheck
import React, { createContext } from 'react';
import { DashboardInsider } from '@/components/Dashboard';
import { useInventoryAdjustments } from '@/hooks/query';

const InventoryAdjustmentsContext = createContext();

/**
 * Accounts chart data provider.
 */
function InventoryAdjustmentsProvider({ query, ...props }) {
  // Handles the inventory adjustments fetching of the given query.
  const {
    isLoading: isAdjustmentsLoading,
    isFetching: isAdjustmentsFetching,
    data: { transactions: inventoryAdjustments, pagination },
  } = useInventoryAdjustments(query, { keepPreviousData: true });

  // Provider payload.
  const provider = {
    inventoryAdjustments,
    isAdjustmentsLoading,
    isAdjustmentsFetching,
    pagination,
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
