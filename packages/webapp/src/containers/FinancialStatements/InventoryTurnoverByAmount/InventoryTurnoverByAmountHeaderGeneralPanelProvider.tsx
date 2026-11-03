import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import type { Item } from '@bigcapital/sdk-ts';
import { useItems } from '@/hooks/query';

interface InventoryTurnoverByAmountGeneralPanelContextValue {
  items: Item[] | undefined;
  isItemsFetching: boolean;
  isItemsLoading: boolean;
}

interface InventoryTurnoverByAmountGeneralPanelProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const InventoryTurnoverByAmountGeneralPanelContext = createContext<
  InventoryTurnoverByAmountGeneralPanelContextValue | undefined
>(undefined);

/**
 * Inventory turnover by amount header general panel provider.
 */
function InventoryTurnoverByAmountGeneralPanelProvider({
  ...props
}: InventoryTurnoverByAmountGeneralPanelProviderProps) {
  const {
    data: itemsData,
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
  } = useItems({
    stringified_filter_roles: JSON.stringify([
      { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
    ]),
    page_size: 10000,
  });

  const provider: InventoryTurnoverByAmountGeneralPanelContextValue = {
    items: (itemsData as any)?.data,
    isItemsFetching,
    isItemsLoading,
  };

  return isItemsLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventoryTurnoverByAmountGeneralPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventoryTurnoverByAmountGeneralPanelContext =
  (): InventoryTurnoverByAmountGeneralPanelContextValue => {
    const ctx = useContext(InventoryTurnoverByAmountGeneralPanelContext);
    if (!ctx) {
      throw new Error(
        'useInventoryTurnoverByAmountGeneralPanelContext must be used within InventoryTurnoverByAmountGeneralPanelProvider',
      );
    }
    return ctx;
  };

export {
  InventoryTurnoverByAmountGeneralPanelProvider,
  useInventoryTurnoverByAmountGeneralPanelContext,
};
