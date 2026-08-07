import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import type { Item } from '@bigcapital/sdk-ts';
import { useItems } from '@/hooks/query';

interface SalesByItemGeneralPanelContextValue {
  items: Item[] | undefined;
  isItemsLoading: boolean;
  isItemsFetching: boolean;
}

interface SalesByItemGeneralPanelProviderProps {
  children?: React.ReactNode;
}

const SalesByItemGeneralPanelContext = createContext<
  SalesByItemGeneralPanelContextValue | undefined
>(undefined);

/**
 * Sales by items - General panel - Booting.
 */
function SalesByItemGeneralPanelProvider({
  ...props
}: SalesByItemGeneralPanelProviderProps) {
  // Handle fetching the items based on the given query.
  const {
    data: itemsData,
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: JSON.stringify([
      { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
    ]),
  });

  const provider: SalesByItemGeneralPanelContextValue = {
    items: (itemsData as any)?.items,
    isItemsLoading,
    isItemsFetching,
  };
  const loading = isItemsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <SalesByItemGeneralPanelContext.Provider value={provider} {...props} />
  );
}

const useSalesByItemsGeneralPanelContext =
  (): SalesByItemGeneralPanelContextValue => {
    const ctx = useContext(SalesByItemGeneralPanelContext);
    if (!ctx) throw new Error('SalesByItemGeneralPanelContext is not provided');
    return ctx;
  };

export { SalesByItemGeneralPanelProvider, useSalesByItemsGeneralPanelContext };
