import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import type { Item } from '@bigcapital/sdk-ts';
import { useItems } from '@/hooks/query';

interface InventoryValuationGeneralPanelContextValue {
  items: Item[] | undefined;
  isItemsFetching: boolean;
  isItemsLoading: boolean;
}

interface InventoryValuationGeneralPanelProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const InventoryValuationGeneralPanelContext = createContext<
  InventoryValuationGeneralPanelContextValue | undefined
>(undefined);

function InventoryValuationGeneralPanelProvider({
  ...props
}: InventoryValuationGeneralPanelProviderProps) {
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

  // Provider data.
  const provider: InventoryValuationGeneralPanelContextValue = {
    items: (itemsData as any)?.items,
    isItemsFetching,
    isItemsLoading,
  };

  const loading = isItemsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventoryValuationGeneralPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventoryValuationGeneralPanelContext =
  (): InventoryValuationGeneralPanelContextValue => {
    const ctx = useContext(InventoryValuationGeneralPanelContext);
    if (!ctx) {
      throw new Error(
        'useInventoryValuationGeneralPanelContext must be used within InventoryValuationGeneralPanelProvider',
      );
    }
    return ctx;
  };

export {
  InventoryValuationGeneralPanelProvider,
  useInventoryValuationGeneralPanelContext,
};
