import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import type { Item } from '@bigcapital/sdk-ts';
import { useItems } from '@/hooks/query';

interface InventoryItemDetailsHeaderGeneralContextValue {
  items: Item[] | undefined;
  isItemsFetching: boolean;
  isItemsLoading: boolean;
}

interface InventoryItemDetailsHeaderGeneralProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const InventoryItemDetailsHeaderGeneralContext = createContext<
  InventoryItemDetailsHeaderGeneralContextValue | undefined
>(undefined);

/**
 * Inventory item details provider.
 */
function InventoryItemDetailsHeaderGeneralProvider({
  ...props
}: InventoryItemDetailsHeaderGeneralProviderProps) {
  // Handle fetching the items based on the given query.
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

  const provider: InventoryItemDetailsHeaderGeneralContextValue = {
    isItemsFetching,
    isItemsLoading,
    items: (itemsData as any)?.items,
  };
  // Loading state.
  const loading = isItemsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventoryItemDetailsHeaderGeneralContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventoryItemDetailsHeaderGeneralContext =
  (): InventoryItemDetailsHeaderGeneralContextValue => {
    const ctx = useContext(InventoryItemDetailsHeaderGeneralContext);
    if (!ctx) {
      throw new Error(
        'useInventoryItemDetailsHeaderGeneralContext must be used within InventoryItemDetailsHeaderGeneralProvider',
      );
    }
    return ctx;
  };

export {
  InventoryItemDetailsHeaderGeneralProvider,
  useInventoryItemDetailsHeaderGeneralContext,
};
