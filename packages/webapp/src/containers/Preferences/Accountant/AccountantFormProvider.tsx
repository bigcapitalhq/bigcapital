import classNames from 'classnames';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import type { AccountsList, AllSettings } from '@bigcapital/sdk-ts';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useAccounts, useSaveSettings, useSettings } from '@/hooks/query';

interface AccountantFormContextValue {
  accounts: AccountsList | undefined;
  allSettings?: AllSettings;
  isAccountsLoading: boolean;
  saveSettingMutate: ReturnType<typeof useSaveSettings>['mutateAsync'];
}

const AccountantFormContext = React.createContext<AccountantFormContextValue>(
  {} as AccountantFormContextValue,
);

interface AccountantFormProviderProps {
  children: ReactNode;
}

function AccountantFormProvider({
  children,
  ...props
}: AccountantFormProviderProps) {
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();
  const { data: allSettings, isLoading: isSettingsLoading } = useSettings();
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  const provider: AccountantFormContextValue = {
    accounts,
    allSettings,
    isAccountsLoading,
    saveSettingMutate,
  };
  const isLoading = isSettingsLoading || isAccountsLoading;

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <AccountantFormCard>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <AccountantFormContext.Provider value={provider} {...props}>
            {children}
          </AccountantFormContext.Provider>
        )}
      </AccountantFormCard>
    </div>
  );
}

const useAccountantFormContext = () => React.useContext(AccountantFormContext);

export { AccountantFormProvider, useAccountantFormContext };

const AccountantFormCard = styled(Card)`
  padding: 25px;
`;
