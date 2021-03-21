import React from 'react';
import { LoadingIndicator } from 'components';
import { useAccounts, useSaveSettings, useSettings } from 'hooks/query';

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

  return (
    <LoadingIndicator loading={isSettingsLoading || isAccountsLoading}>
      <AccountantFormContext.Provider value={provider} {...props} />
    </LoadingIndicator>
  );
}

const useAccountantFormContext = () => React.useContext(AccountantFormContext);
export { AccountantFormProvider, useAccountantFormContext };
