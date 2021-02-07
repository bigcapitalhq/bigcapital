import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useInventoryAdjustments } from 'hooks/query';

const InventoryAdjustmentsContext = createContext();

/**
 * Accounts chart data provider.
 */
function InventoryAdjustmentsProvider({ query, ...props }) {
  const {
    isFetching: isAdjustmentsLoading,
    data: {
        transactions: inventoryAdjustments,
        pagination,
    },
  } = useInventoryAdjustments(query);

  // Provider payload.
  const provider = {
    inventoryAdjustments,
    isAdjustmentsLoading,
    pagination
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
