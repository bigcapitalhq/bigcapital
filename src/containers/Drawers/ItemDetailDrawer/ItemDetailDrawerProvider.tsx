import React from 'react';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { useItem } from 'hooks/query';
import { inactiveStatus } from './utlis';

const ItemDetailDrawerContext = React.createContext();

/**
 * Item detail provider
 */
function ItemDetailDrawerProvider({ itemId, ...props }) {
  // transaction type payload.
  const [value, setValue] = React.useState('invoices');

  // Fetches the given item detail.
  const { isLoading: isItemLoading, data: item } = useItem(itemId, {
    enabled: !!itemId,
  });

  //provider.
  const provider = {
    item,
    itemId,
    isItemLoading,
    value,
    setValue,
  };

  return (
    <DrawerLoading loading={isItemLoading}>
      <DrawerHeaderContent
        name="item-detail-drawer"
        title={inactiveStatus(item)}
      />
      <ItemDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}
const useItemDetailDrawerContext = () =>
  React.useContext(ItemDetailDrawerContext);

export { ItemDetailDrawerProvider, useItemDetailDrawerContext };
