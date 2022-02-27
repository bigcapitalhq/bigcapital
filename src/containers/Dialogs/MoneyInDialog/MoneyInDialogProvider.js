import React from 'react';
import { DialogContent } from 'components';
import {
  useCreateCashflowTransaction,
  useAccount,
  useAccounts,
  useCashflowAccounts,
  useSettingCashFlow,
} from 'hooks/query';
import { isEqual, isUndefined } from 'lodash';

const MoneyInDialogContent = React.createContext();

/**
 * Money in dialog provider.
 */
function MoneyInDialogProvider({
  accountId,
  accountType,
  dialogName,
  ...props
}) {
  // Fetches accounts list.
  const { isFetching: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });

  // Fetch cash flow list .
  const { data: cashflowAccounts, isLoading: isCashFlowAccountsLoading } =
    useCashflowAccounts({}, { keepPreviousData: true });

  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingCashFlow();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Determines whether the foreign currency.
  const isForeignCurrency = (toCurrency, fromCurrency) =>
    !isEqual(toCurrency, fromCurrency) && !isUndefined(toCurrency);

  //  provider.
  const provider = {
    accounts,
    account,
    accountId,
    accountType,
    isAccountsLoading,

    cashflowAccounts,

    submitPayload,
    dialogName,

    createCashflowTransactionMutate,
    setSubmitPayload,
    isForeignCurrency,
  };

  return (
    <DialogContent
      isLoading={
        isAccountsLoading || isCashFlowAccountsLoading || isSettingsLoading
      }
    >
      <MoneyInDialogContent.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useMoneyInDailogContext = () => React.useContext(MoneyInDialogContent);

export { MoneyInDialogProvider, useMoneyInDailogContext };
