import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useAccounts, useSaveSettings, useSettings } from 'hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const AccountantFormContext = React.createContext();

/**
 * Accountant data provider.
 */
function AccountantFormProvider({ ...props }) {
  // Fetches the accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  //Fetches Organization Settings.
  const { isLoading: isSettingsLoading } = useSettings();

  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  // Provider state.
  const provider = {
    accounts,
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
      <div className={classNames(CLASSES.CARD)}>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <AccountantFormContext.Provider value={provider} {...props} />
        )}
      </div>
    </div>
  );
}

const useAccountantFormContext = () => React.useContext(AccountantFormContext);
export { AccountantFormProvider, useAccountantFormContext };
