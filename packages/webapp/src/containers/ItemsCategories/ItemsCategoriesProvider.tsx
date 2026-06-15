// @ts-nocheck
import React, { createContext } from 'react';
import { DashboardInsider } from '@/components';
import { useItemsCategories, useResourceMeta } from '@/hooks/query';
import { transformTableStateToQuery, getFieldsFromResourceMeta } from '@/utils';

const ItemsCategoriesContext = createContext();

/**
 * Items categories provider.
 */
function ItemsCategoriesProvider({ tableState, ...props }) {
  // Transformes the table state to query.
  const query = transformTableStateToQuery(tableState);

  // Items categories list.
  const {
    data: itemsCategoriesData,
    isFetching: isCategoriesFetching,
    isLoading: isCategoriesLoading,
  } = useItemsCategories(query, {
    placeholderData: (previousData) => previousData,
  });

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('item_category');

  const state = {
    isCategoriesFetching,
    isCategoriesLoading,

    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    resourceMeta,
    isResourceLoading,
    isResourceFetching,

    itemsCategories: itemsCategoriesData?.itemsCategories,
    pagination: itemsCategoriesData?.pagination,
    query,
  };

  return (
    <DashboardInsider
      isLoading={isResourceLoading}
      name={'items-categories-list'}
    >
      <ItemsCategoriesContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useItemsCategoriesContext = () =>
  React.useContext(ItemsCategoriesContext);

export { ItemsCategoriesProvider, useItemsCategoriesContext };
