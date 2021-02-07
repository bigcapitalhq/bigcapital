import React, { useEffect, createContext, useState } from 'react';
import { useIntl } from 'react-intl';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useItem,
  useItemsCategories,
  useCreateItem,
  useEditItem,
  useAccounts,
} from 'hooks/query';
import { useDashboardPageTitle } from 'hooks/state';

const ItemFormContext = createContext();

/**
 * Accounts chart data provider.
 */
function ItemFormProvider({ itemId, ...props }) {
  // Fetches the accounts list.
  const { isFetching: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the items categories list.
  const {
    isFetching: isItemsCategoriesLoading,
    data: { itemsCategories },
  } = useItemsCategories();

  // Fetches the given item details.
  const { isFetching: isItemLoading, data: item } = useItem(itemId, {
    enabled: !!itemId,
  });
  // Create and edit item mutations.
  const { mutateAsync: editItemMutate } = useEditItem();
  const { mutateAsync: createItemMutate } = useCreateItem();

  // Holds data of submit button once clicked to form submit function.
  const [submitPayload, setSubmitPayload] = useState({});

  // Detarmines whether the form new mode.
  const isNewMode = !itemId;

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
    setSubmitPayload
  };

  // Format message intl.
  const { formatMessage } = useIntl();
  
  // Change page title dispatcher.
  const changePageTitle = useDashboardPageTitle();

  // Changes the page title in new and edit mode.
  useEffect(() => {
    !isNewMode
      ? changePageTitle(formatMessage({ id: 'edit_item_details' }))
      : changePageTitle(formatMessage({ id: 'new_item' }));
  }, [changePageTitle, isNewMode, formatMessage]);

  return (
    <DashboardInsider
      loading={isAccountsLoading || isItemsCategoriesLoading || isItemLoading}
      name={'item-form'}
    >
      <ItemFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useItemFormContext = () => React.useContext(ItemFormContext);

export { ItemFormProvider, useItemFormContext };
