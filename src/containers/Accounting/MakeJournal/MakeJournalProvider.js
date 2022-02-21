import React, { createContext, useState } from 'react';
import { isEqual, isUndefined } from 'lodash';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useAccounts,
  useAutoCompleteContacts,
  useCurrencies,
  useJournal,
  useCreateJournal,
  useEditJournal,
  useSettings,
  useSettingsManualJournals,
} from 'hooks/query';

const MakeJournalFormContext = createContext();

/**
 * Make journal form provider.
 */
function MakeJournalProvider({ journalId, baseCurrency, ...props }) {
  // Load the accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Load the customers list.
  const { data: contacts, isLoading: isContactsLoading } =
    useAutoCompleteContacts();

  // Load the currencies list.
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  // Load the details of the given manual journal.
  const { data: manualJournal, isLoading: isJournalLoading } = useJournal(
    journalId,
    {
      enabled: !!journalId,
    },
  );
  // Create and edit journal mutations.
  const { mutateAsync: createJournalMutate } = useCreateJournal();
  const { mutateAsync: editJournalMutate } = useEditJournal();

  // Loading the journal settings.
  const { isLoading: isSettingsLoading } = useSettingsManualJournals();

  // Submit form payload.
  const [submitPayload, setSubmitPayload] = useState({});
  const [selectJournalCurrency, setSelactJournalCurrency] = useState(null);

  const isForeignJournal =
    !isEqual(selectJournalCurrency?.currency_code, baseCurrency) &&
    !isUndefined(selectJournalCurrency?.currency_code);

  const provider = {
    accounts,
    contacts,
    currencies,
    manualJournal,
    baseCurrency,

    createJournalMutate,
    editJournalMutate,

    isAccountsLoading,
    isContactsLoading,
    isCurrenciesLoading,
    isJournalLoading,
    isSettingsLoading,
    isForeignJournal,
    isNewMode: !journalId,

    submitPayload,
    setSubmitPayload,
    selectJournalCurrency,
    setSelactJournalCurrency,
  };

  return (
    <DashboardInsider
      loading={
        isJournalLoading ||
        isAccountsLoading ||
        isCurrenciesLoading ||
        isContactsLoading ||
        isSettingsLoading
      }
      name={'make-journal-page'}
    >
      <MakeJournalFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useMakeJournalFormContext = () =>
  React.useContext(MakeJournalFormContext);

export { MakeJournalProvider, useMakeJournalFormContext };
