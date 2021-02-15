import React, { createContext, useContext } from 'react';
import { DialogContent } from 'components';
import {
  useCreateAccount,
  useAccountsTypes,
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
  const {
    data: accountsTypes,
    isLoading: isAccountsTypesLoading,
  } = useAccountsTypes();

  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });

  const isNewMode = !accountId;

  // Provider payload.
  const provider = {
    dialogName,
    accountId,
    parentAccountId,
    action,
    accountType,

    createAccountMutate,
    editAccountMutate,
    accounts,
    accountsTypes,
    account,

    isAccountsLoading,
    isNewMode
  };

  const isLoading =
    isAccountsLoading || isAccountsTypesLoading || isAccountLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <AccountDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useAccountDialogContext = () => useContext(AccountDialogContext);

export { AccountDialogProvider, useAccountDialogContext };
