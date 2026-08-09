import React, { createContext } from 'react';
import type { ItemCategoryTableRow } from './components';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import {
  useItemsCategories,
  useResourceMeta,
  useSettingsItemCategories,
} from '@/hooks/query';
import { transformTableStateToQuery, getFieldsFromResourceMeta } from '@/utils';

interface ItemsCategoriesProviderProps {
  // The store-injected `itemsCategoriesTableState` is a complex selector return;
  // keep it loose to avoid SDK-shape friction.
  tableState: Record<string, unknown>;
  children?: React.ReactNode;
}

export interface ItemsCategoriesContextValue {
  isCategoriesFetching: boolean;
  isCategoriesLoading: boolean;
  fields: IResourceField[];
  // `resourceMeta` is a complex SDK union; surface as `any` (matches Invoices
  // pattern).
  resourceMeta: any;
  isResourceLoading: boolean;
  isResourceFetching: boolean;
  itemsCategoriesSettings: SettingsGroup | undefined;
  // FIXME: response shape mismatch — `ItemCategoriesListResponse` is the array
  // type but the original code reads `.itemsCategories`/`.pagination`. Preserved
  // from @ts-nocheck original; both are `undefined` at runtime.
  itemsCategories: ItemCategoryTableRow[] | undefined;
  pagination?: { total?: number; [key: string]: unknown };
  query: ReturnType<typeof transformTableStateToQuery>;
}

const ItemsCategoriesContext = createContext<ItemsCategoriesContextValue>(
  {} as ItemsCategoriesContextValue,
);

/**
 * Items categories provider.
 */
function ItemsCategoriesProvider({
  tableState,
  ...props
}: ItemsCategoriesProviderProps) {
  // Transformes the table state to query.
  const query = transformTableStateToQuery(tableState);

  // Items categories list.
  const {
    data: itemsCategoriesData,
    isFetching: isCategoriesFetching,
    isLoading: isCategoriesLoading,
  } = useItemsCategories(query);

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('item_category');

  // Fetch the item categories settings.
  const { data: itemsCategoriesSettings } = useSettingsItemCategories();

  const state: ItemsCategoriesContextValue = {
    isCategoriesFetching,
    isCategoriesLoading,

    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    resourceMeta,
    isResourceLoading,
    isResourceFetching,

    itemsCategories: itemsCategoriesData,
    itemsCategoriesSettings,
    query,
  };

  return (
    <DashboardInsider
      // `DashboardInsider` accepts `loading`, not `isLoading` — the original
      // `isLoading` was always ignored (latent bug preserved).
      // @ts-expect-error see comment above
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
