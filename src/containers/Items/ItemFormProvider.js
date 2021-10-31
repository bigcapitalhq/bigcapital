import React, { useEffect, createContext, useState } from 'react';
import intl from 'react-intl-universal';
import { useLocation } from 'react-router-dom';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useItem,
  useSettingsItems,
  useItemsCategories,
  useCreateItem,
  useEditItem,
  useAccounts,
} from 'hooks/query';
import { useDashboardPageTitle } from 'hooks/state';
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

  // Detarmines whether the form new mode.
  const isNewMode = duplicateId || !itemId;

  // Provider state.
  const provider = {
    itemId,
    accounts,
    item,
    itemsCategories,
    submitPayload,
    isNewMode,

    isAccountsLoading,
    isItemsCategoriesLoading,
    isItemLoading,

    createItemMutate,
    editItemMutate,
    setSubmitPayload,
  };

  // Change page title dispatcher.
  const changePageTitle = useDashboardPageTitle();

  // Changes the page title in new and edit mode.
  useEffect(() => {
    isNewMode
      ? changePageTitle(intl.get('new_item'))
      : changePageTitle(intl.get('edit_item_details'));
  }, [changePageTitle, isNewMode]);

  const loading =
    isItemsSettingsLoading ||
    isAccountsLoading ||
    isItemsCategoriesLoading ||
    isItemLoading;

  return (
    <DashboardInsider loading={loading} name={'item-form'}>
      <ItemFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useItemFormContext = () => React.useContext(ItemFormContext);

export { ItemFormProvider, useItemFormContext };
