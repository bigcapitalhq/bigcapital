// @ts-nocheck
import React, { createContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useItem,
  useSettingsItems,
  useItemsCategories,
  useCreateItem,
  useEditItem,
  useAccounts,
} from '@/hooks/query';
import { useWatchItemError } from './utils';

const ItemFormContext = createContext();

/**
 * Accounts chart data provider.
 */
function ItemFormProvider({ itemId, ...props }) {
  const { state } = useLocation();

  const duplicateId = state?.action;

  // Fetches the accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the items categories list.
  const {
    isLoading: isItemsCategoriesLoading,
    data: { itemsCategories },
  } = useItemsCategories();

  // Fetches the given item details.
  const itemQuery = useItem(itemId || duplicateId, {
    enabled: !!itemId || !!duplicateId,
  });

  const { isLoading: isItemLoading, data: item } = itemQuery;

  // Watches and handles item not found response error.
  useWatchItemError(itemQuery);

  // Fetches item settings.
  const {
    isLoading: isItemsSettingsLoading,
    isFetching: isItemsSettingsFetching,
  } = useSettingsItems();

  // Create and edit item mutations.
  const { mutateAsync: editItemMutate } = useEditItem();
  const { mutateAsync: createItemMutate } = useCreateItem();

  // Holds data of submit button once clicked to form submit function.
  const [submitPayload, setSubmitPayload] = useState({});

  // Determines whether the form new mode.
  const isNewMode = duplicateId || !itemId;

  // Determines the form loading state.
  const isFormLoading =
    isItemsSettingsLoading ||
    isAccountsLoading ||
    isItemsCategoriesLoading ||
    isItemLoading;

  // Provider state.
  const provider = {
    itemId,
    accounts,
    item,
    itemsCategories,
    submitPayload,
    isNewMode,

    isFormLoading,
    isAccountsLoading,
    isItemsCategoriesLoading,
    isItemLoading,

    createItemMutate,
    editItemMutate,
    setSubmitPayload,
  };

  return <ItemFormContext.Provider value={provider} {...props} />;
}

const useItemFormContext = () => React.useContext(ItemFormContext);

export { ItemFormProvider, useItemFormContext };
