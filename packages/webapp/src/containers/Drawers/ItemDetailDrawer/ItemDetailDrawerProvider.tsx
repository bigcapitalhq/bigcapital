import React from 'react';
import { inactiveStatus } from './utils';
import type { Item } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useItem } from '@/hooks/query';

export interface ItemDetailDrawerContextValue {
  item: Item | undefined;
  itemId: number | undefined;
  isItemLoading: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

interface ItemDetailDrawerProviderProps {
  itemId: number | undefined;
  children?: React.ReactNode;
}

const ItemDetailDrawerContext = React.createContext<
  ItemDetailDrawerContextValue | undefined
>(undefined);

/**
 * Item detail provider
 */
function ItemDetailDrawerProvider({
  itemId,
  children,
}: ItemDetailDrawerProviderProps) {
  // transaction type payload.
  const [value, setValue] = React.useState('invoices');

  // Fetches the given item detail.
  const { isLoading: isItemLoading, data: item } = useItem(itemId, {
    enabled: !!itemId,
  });

  //provider.
  const provider: ItemDetailDrawerContextValue = {
    item,
    itemId,
    isItemLoading,
    value,
    setValue,
  };

  return (
    <DrawerLoading loading={isItemLoading}>
      <DrawerHeaderContent
        name={DRAWERS.ITEM_DETAILS}
        title={inactiveStatus(item)}
      />
      <ItemDetailDrawerContext.Provider value={provider}>
        {children}
      </ItemDetailDrawerContext.Provider>
    </DrawerLoading>
  );
}

const useItemDetailDrawerContext = (): ItemDetailDrawerContextValue => {
  const ctx = React.useContext(ItemDetailDrawerContext);
  if (!ctx) {
    throw new Error(
      'useItemDetailDrawerContext must be used within ItemDetailDrawerProvider',
    );
  }
  return ctx;
};

export { ItemDetailDrawerProvider, useItemDetailDrawerContext };
