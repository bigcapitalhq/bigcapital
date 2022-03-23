import React, { createContext, useContext } from 'react';
import { DialogContent } from 'components';
import {
  useCreateAccount,
  useAccountsTypes,
  useCurrencies,
  useAccount,
  useAccounts,
  useEditAccount,
} from 'hooks/query';

const AccountDialogContext = createContext();

/**
 * Account form provider.
 */
function AccountDialogProvider({
  accountId,
  parentAccountId,
  action,
  accountType,

  dialogName,
  ...props
}) {
  // Create and edit account mutations.
  const { mutateAsync: createAccountMutate } = useCreateAccount();
  const { mutateAsync: editAccountMutate } = useEditAccount();

  // Fetches accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetches accounts types.
  const { data: accountsTypes, isLoading: isAccountsTypesLoading } =
    useAccountsTypes();

  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });

  // Handle fetch Currencies data table
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  const isNewMode = !accountId;

  // Provider payload.
  const provider = {
    dialogName,
    accountId,
    parentAccountId,
    action,
    accountType,
    currencies,

    createAccountMutate,
    editAccountMutate,
    accounts,
    accountsTypes,
    account,

    isAccountsLoading,
    isCurrenciesLoading,
    isNewMode,
  };

  const isLoading =
    isAccountsLoading ||
    isAccountsTypesLoading ||
    isAccountLoading ||
    isCurrenciesLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <AccountDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useAccountDialogContext = () => useContext(AccountDialogContext);

export { AccountDialogProvider, useAccountDialogContext };
