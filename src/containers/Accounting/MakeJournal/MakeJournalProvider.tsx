// @ts-nocheck
import React, { createContext, useState } from 'react';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { DashboardInsider } from '@/components';
import {
  useAccounts,
  useAutoCompleteContacts,
  useCurrencies,
  useJournal,
  useCreateJournal,
  useEditJournal,
  useBranches,
  useSettingsManualJournals,
} from '@/hooks/query';
import { useProjects } from '@/containers/Projects/hooks';

const MakeJournalFormContext = createContext();

/**
 * Make journal form provider.
 */
function MakeJournalProvider({ journalId, query, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectFeatureCan = featureCan(Features.Projects);

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

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetch the projects list.
  const {
    data: { projects },
    isLoading: isProjectsLoading,
  } = useProjects({}, { enabled: !!isProjectFeatureCan });

  // Submit form payload.
  const [submitPayload, setSubmitPayload] = useState({});

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isBranchesLoading;

  const provider = {
    accounts,
    contacts,
    currencies,
    manualJournal,
    projects,
    branches,

    createJournalMutate,
    editJournalMutate,

    isAccountsLoading,
    isContactsLoading,
    isCurrenciesLoading,
    isJournalLoading,
    isFeatureLoading,
    isSettingsLoading,
    isBranchesSuccess,
    isNewMode: !journalId,

    submitPayload,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={
        isJournalLoading ||
        isAccountsLoading ||
        isCurrenciesLoading ||
        isContactsLoading ||
        isSettingsLoading ||
        isProjectsLoading
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
