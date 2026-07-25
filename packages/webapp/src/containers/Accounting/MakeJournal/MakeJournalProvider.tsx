import React, { createContext, useState } from 'react';
import type {
  ManualJournal,
  CreateManualJournalBody,
  EditManualJournalBody,
  AccountsList,
  BranchesListResponse,
  CurrenciesListResponse,
  ContactsAutoCompleteResponse,
  SettingsGroup,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import { Features } from '@/constants';
import { useProjects } from '@/containers/Projects/hooks';
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
import { useFeatureCan } from '@/hooks/state';

type MakeJournalFormSubmitPayload = {
  redirect?: boolean;
  publish?: boolean;
  resetForm?: boolean;
};

type MakeJournalFormContextValue = {
  accounts: AccountsList;
  contacts: ContactsAutoCompleteResponse;
  currencies: CurrenciesListResponse;
  branches: BranchesListResponse;
  manualJournal: ManualJournal | undefined;
  projects: unknown[];
  submitPayload: MakeJournalFormSubmitPayload;
  isNewMode: boolean;
  manualJournalsSettings: SettingsGroup | undefined;

  createJournalMutate: (values: CreateManualJournalBody) => Promise<void>;
  editJournalMutate: (args: [number, EditManualJournalBody]) => Promise<void>;

  isAccountsLoading: boolean;
  isContactsLoading: boolean;
  isCurrenciesLoading: boolean;
  isJournalLoading: boolean;
  isFeatureLoading: boolean;
  isSettingsLoading: boolean;
  isBranchesLoading: boolean;
  isBranchesSuccess: boolean;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<MakeJournalFormSubmitPayload>
  >;
};

type MakeJournalProviderProps = {
  journalId?: number | string;
  query?: Record<string, unknown>;
  children?: React.ReactNode;
};

const MakeJournalFormContext = createContext<
  MakeJournalFormContextValue | undefined
>(undefined);

/**
 * Make journal form provider.
 */
function MakeJournalProvider({
  journalId,
  query,
  ...props
}: MakeJournalProviderProps) {
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
    journalId ? Number(journalId) : undefined,
    {
      enabled: !!journalId,
    },
  );
  // Create and edit journal mutations.
  const { mutateAsync: createJournalMutate } = useCreateJournal();
  const { mutateAsync: editJournalMutate } = useEditJournal();

  // Loading the journal settings.
  const { data: manualJournalsSettings, isLoading: isSettingsLoading } =
    useSettingsManualJournals();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetch the projects list.
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(
    {},
    { enabled: !!isProjectFeatureCan },
  );

  // Submit form payload.
  const [submitPayload, setSubmitPayload] =
    useState<MakeJournalFormSubmitPayload>({});

  // Determines whether the branches are loading.
  const isFeatureLoading = isBranchesLoading || isProjectsLoading;

  const provider: MakeJournalFormContextValue = {
    accounts: accounts ?? [],
    contacts: contacts ?? [],
    currencies: currencies ?? [],
    manualJournal,
    projects: projectsData?.projects ?? [],
    branches: branches ?? [],

    createJournalMutate,
    editJournalMutate,

    isAccountsLoading,
    isContactsLoading,
    isCurrenciesLoading,
    isJournalLoading,
    isFeatureLoading,
    isSettingsLoading,
    isBranchesLoading,
    isBranchesSuccess,
    isNewMode: !journalId,
    manualJournalsSettings,

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

const useMakeJournalFormContext = (): MakeJournalFormContextValue => {
  const ctx = React.useContext(MakeJournalFormContext);
  if (!ctx) {
    throw new Error(
      'useMakeJournalFormContext must be used within a MakeJournalProvider',
    );
  }
  return ctx;
};

export { MakeJournalProvider, useMakeJournalFormContext };
