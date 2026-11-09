import classNames from 'classnames';
import React, { createContext } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import type { Account, User } from '@bigcapital/sdk-ts';
import type { SaveSettingsBody, SettingsGroup } from '@bigcapital/sdk-ts';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import {
  useAccounts,
  useSaveSettings,
  useSettingsItems,
  useUsers,
} from '@/hooks/query';

interface ItemPreferencesFormContextValue {
  accounts: Account[];
  users: User[];
  itemsSettings?: SettingsGroup;
  saveSettingMutate: (vars: {
    options: SaveSettingsBody['options'];
  }) => Promise<unknown>;
}

const ItemFormContext = createContext<ItemPreferencesFormContextValue>(
  {} as ItemPreferencesFormContextValue,
);

interface ItemPreferencesFormProviderProps {
  children?: React.ReactNode;
}

function ItemPreferencesFormProvider({
  ...props
}: ItemPreferencesFormProviderProps) {
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();
  const { isLoading: isUsersLoading, data: users } = useUsers();

  const { data: itemsSettings, isLoading: isItemsSettingsLoading } =
    useSettingsItems();

  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  const provider: ItemPreferencesFormContextValue = {
    accounts: accounts ?? [],
    users: users ?? [],
    itemsSettings,
    saveSettingMutate,
  };

  const isLoading =
    isAccountsLoading || isUsersLoading || isItemsSettingsLoading;

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
