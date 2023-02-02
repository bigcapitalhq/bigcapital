// @ts-nocheck
import React, { useContext, createContext } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Card } from '@/components';
import { useSettingsItems, useAccounts, useSaveSettings } from '@/hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const ItemFormContext = createContext();

/**
 * Item data provider.
 */

function ItemPreferencesFormProvider({ ...props }) {
  // Fetches the accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  const {
    isLoading: isItemsSettingsLoading,
    isFetching: isItemsSettingsFetching,
  } = useSettingsItems();

  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  // Provider state.
  const provider = {
    accounts,
    saveSettingMutate,
  };

  const isLoading = isAccountsLoading || isItemsSettingsLoading;

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <ItemsPreferencesCard>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <ItemFormContext.Provider value={provider} {...props} />
        )}
      </ItemsPreferencesCard>
    </div>
  );
}

const useItemPreferencesFormContext = () => useContext(ItemFormContext);

export { useItemPreferencesFormContext, ItemPreferencesFormProvider };

const ItemsPreferencesCard = styled(Card)`
  padding: 25px;
`;
