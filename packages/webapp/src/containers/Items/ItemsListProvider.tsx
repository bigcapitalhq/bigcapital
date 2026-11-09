import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import { transformItemsTableState } from './utils';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import {
  useResourceViews,
  useResourceMeta,
  useItems,
  useSettingsItems,
} from '@/hooks/query';
import {
  getFieldsFromResourceMeta,
  transformTableQueryToParams,
} from '@/utils';

type UseItemsResult = ReturnType<typeof useItems>;
type UseResourceViewsResult = ReturnType<typeof useResourceViews>;

type ItemsListContextValue = {
  itemsViews: UseResourceViewsResult['data'];
  items: NonNullable<UseItemsResult['data']>['data'] | undefined;
  pagination: NonNullable<UseItemsResult['data']>['pagination'] | undefined;

  fields: ReturnType<typeof getFieldsFromResourceMeta> | [];

  itemsSettings: SettingsGroup | undefined;

  isViewsLoading: boolean;
  isItemsLoading: boolean;
  isItemsFetching: boolean;
  isResourceLoading: boolean;
  isResourceFetching: boolean;

  isEmptyStatus: boolean;
};

type ItemsListProviderProps = {
  tableState: any;
  tableStateChanged: boolean;
  children?: React.ReactNode;
};

const ItemsContext = createContext<ItemsListContextValue | undefined>(
  undefined,
);

/**
 * Items list provider.
 */
function ItemsListProvider({
  tableState,
  tableStateChanged,
  ...props
}: ItemsListProviderProps) {
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
    data: itemsData,
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({
    ...(transformTableQueryToParams(tableQuery) as Record<string, unknown>),
  });

  // Fetch the items settings.
  const { data: itemsSettings } = useSettingsItems();

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    !tableStateChanged && !isItemsLoading && isEmpty(itemsData?.data);

  const state: ItemsListContextValue = {
    itemsViews,
    items: itemsData?.data,
    pagination: itemsData?.pagination,

    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],

    itemsSettings,

    isViewsLoading,
    isItemsLoading,
    isItemsFetching,
    isResourceLoading,
    isResourceFetching,

    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'items-list'}
    >
      <ItemsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useItemsListContext = (): ItemsListContextValue => {
  const ctx = React.useContext(ItemsContext);
  if (!ctx) {
    throw new Error(
      'useItemsListContext must be used within an ItemsListProvider',
    );
  }
  return ctx;
};

export { ItemsListProvider, useItemsListContext };
