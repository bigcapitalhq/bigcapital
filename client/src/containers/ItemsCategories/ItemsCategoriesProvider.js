import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useItemsCategories } from 'hooks/query';

const ItemsCategoriesContext = createContext();

/**
 * Items categories provider.
 */
function ItemsCategoriesProvider({ query, ...props }) {
  const {
    data: { itemsCategories, pagination },
    isFetching: isItemsCategoriesFetching,
  } = useItemsCategories();

  const state = {
    isItemsCategoriesFetching,
    itemsCategories,
    pagination,
  };

  return (
    <DashboardInsider name={'item-category-list'}>
      <ItemsCategoriesContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useItemsCategoriesContext = () =>
  React.useContext(ItemsCategoriesContext);

export {
  ItemsCategoriesProvider,
  useItemsCategoriesContext,
};
