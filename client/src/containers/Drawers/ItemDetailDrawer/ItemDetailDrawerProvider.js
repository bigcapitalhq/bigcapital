import React from 'react';
import { DrawerHeaderContent, DashboardInsider } from 'components';
import { useItem } from 'hooks/query';

const ItemDetailDrawerContext = React.createContext();

/**
 * Item detail provider
 */
function ItemDetailDrawerProvider({ itemId, ...props }) {
  // Fetches the given item detail.
  const { isLoading: isItemLoading, data: item } = useItem(itemId, {
    enabled: !!itemId,
  });

  //provider.
  const provider = {
    item,
    itemId,
    isItemLoading,
  };

  return (
    <DashboardInsider loading={isItemLoading}>
      <DrawerHeaderContent name="item-detail-drawer" title={item?.name} />
      <ItemDetailDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const useItemDetailDrawerContext = () =>
  React.useContext(ItemDetailDrawerContext);

export { ItemDetailDrawerProvider, useItemDetailDrawerContext };
