import React, { createContext } from 'react';

import {
  getFieldsFromResourceMeta,
  transformTableQueryToParams,
  isTableEmptyStatus,
} from 'utils';
import { transformItemsTableState } from './utils';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceMeta, useItems } from 'hooks/query';

const ItemsContext = createContext();

/**
 * Items list provider.
 */
function ItemsListProvider({ tableState, ...props }) {
  const tableQuery = transformItemsTableState(tableState);

  // Fetch accounts resource views and fields.
  const { data: itemsViews, isLoading: isViewsLoading } =
    useResourceViews('items');

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('items');

  // Handle fetching the items table based on the given query.
  const {
    data: { items, pagination, filterMeta },
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems(
    {
      ...transformTableQueryToParams(tableQuery),
    },
    { keepPreviousData: true },
  );

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: items,
      pagination,
      filterMeta,
    }) &&
    !isItemsFetching &&
    !tableState.inactiveMode;

  const state = {
    itemsViews,
    items,
    pagination,

    fields: getFieldsFromResourceMeta(resourceMeta.fields),

    isViewsLoading,
    isItemsLoading,
    isItemsFetching: isItemsFetching,
    isResourceLoading,
    isResourceFetching,

    isEmptyStatus,
  };

  return (
    <DashboardInsider loading={isItemsLoading || isResourceLoading} name={'items-list'}>
      <ItemsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useItemsListContext = () => React.useContext(ItemsContext);

export { ItemsListProvider, useItemsListContext };
