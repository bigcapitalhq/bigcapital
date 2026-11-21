import React, { createContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWatchItemError } from './utils';
import type {
  Item,
  AccountsList,
  TaxRatesListResponse,
  CreateItemBody,
  CreateItemResponse,
  EditItemBody,
  ItemCategoriesListResponse,
} from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import {
  useItem,
  useSettingsItems,
  useItemsCategories,
  useCreateItem,
  useEditItem,
  useAccounts,
} from '@/hooks/query';
import { useTaxRates } from '@/hooks/query/tax-rates';
import { useFeatureCan } from '@/hooks/state';

type ItemFormSubmitPayload = {
  redirect?: boolean;
};

type ItemFormProviderProps = {
  itemId?: number;
  children?: React.ReactNode;
};

type ItemFormContextValue = {
  itemId?: number;
  accounts: AccountsList;
  item: Item | undefined;
  itemsCategories: ItemCategoriesListResponse;
  taxRates: TaxRatesListResponse;
  submitPayload: ItemFormSubmitPayload;
  isNewMode: boolean;
  itemImagesEnabled: boolean;

  isFormLoading: boolean;
  isAccountsLoading: boolean;
  isItemsCategoriesLoading: boolean;
  isItemLoading: boolean;
  isTaxRatesLoading: boolean;

  createItemMutate: (values: CreateItemBody) => Promise<CreateItemResponse>;
  editItemMutate: (args: [number, EditItemBody]) => Promise<void>;
  setSubmitPayload: React.Dispatch<React.SetStateAction<ItemFormSubmitPayload>>;
};

const ItemFormContext = createContext<ItemFormContextValue | undefined>(
  undefined,
);

/**
 * Accounts chart data provider.
 */
function ItemFormProvider({ itemId, ...props }: ItemFormProviderProps) {
  const { state } = useLocation<{ action?: number | string }>();
  const duplicateId = state?.action;

  // Feature flags.
  const { featureCan } = useFeatureCan();

  // Fetches the accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the items categories list.
  const { isLoading: isItemsCategoriesLoading, data: itemsCategories } =
    useItemsCategories();

  const { data: taxRates, isLoading: isTaxRatesLoading } = useTaxRates({
    enabled: featureCan(Features.SalesTax),
  });

  // Fetches the given item details.
  const itemQuery = useItem(itemId || (duplicateId as number | undefined), {
    enabled: !!itemId || !!duplicateId,
  });
  const { isLoading: isItemLoading, data: item } = itemQuery;

  // Watches and handles item not found response error.
  useWatchItemError(itemQuery);

  // Fetches item settings.
  const { isLoading: isItemsSettingsLoading, data: itemsSettings } =
    useSettingsItems();
  const itemImagesEnabled = Boolean(itemsSettings?.itemImagesEnabled);

  // Create and edit item mutations.
  const { mutateAsync: editItemMutate } = useEditItem();
  const { mutateAsync: createItemMutate } = useCreateItem();

  // Holds data of submit button once clicked to form submit function.
  const [submitPayload, setSubmitPayload] = useState<ItemFormSubmitPayload>({});

  // Determines whether the form is in new mode.
  const isNewMode = Boolean(duplicateId) || !itemId;

  // Determines the form loading state.
  const isFormLoading =
    isItemsSettingsLoading ||
    isAccountsLoading ||
    isItemsCategoriesLoading ||
    isTaxRatesLoading ||
    isItemLoading;

  // Provider state.
  const provider: ItemFormContextValue = {
    itemId,
    accounts: accounts ?? [],
    item,
    itemsCategories: itemsCategories ?? [],
    taxRates: taxRates ?? [],
    submitPayload,
    isNewMode,
    itemImagesEnabled,

    isFormLoading,
    isAccountsLoading,
    isItemsCategoriesLoading,
    isItemLoading,
    isTaxRatesLoading,

    createItemMutate: createItemMutate as (
      values: CreateItemBody,
    ) => Promise<CreateItemResponse>,
    editItemMutate: editItemMutate as (
      args: [number, EditItemBody],
    ) => Promise<void>,
    setSubmitPayload,
  };

  return <ItemFormContext.Provider value={provider} {...props} />;
}

const useItemFormContext = (): ItemFormContextValue => {
  const ctx = React.useContext(ItemFormContext);
  if (!ctx) {
    throw new Error(
      'useItemFormContext must be used within an ItemFormProvider',
    );
  }
  return ctx;
};

export { ItemFormProvider, useItemFormContext };
