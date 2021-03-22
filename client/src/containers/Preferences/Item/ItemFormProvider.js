import React, { useContext, createContext } from 'react';
import { LoadingIndicator } from 'components';

import { useAccounts, useSaveSettings } from 'hooks/query';

const ItemFormContext = createContext();

/**
 * Item data provider.
 */

function ItemFormProvider({ ...props }) {
  // Fetches the accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  // Provider state.
  const provider = {
    accounts,
    saveSettingMutate,
  };

  return (
    <LoadingIndicator loading={isAccountsLoading}>
      <ItemFormContext.Provider value={provider} {...props} />
    </LoadingIndicator>
  );
}

const useItemFormContext = () => useContext(ItemFormContext);

export { useItemFormContext, ItemFormProvider };
