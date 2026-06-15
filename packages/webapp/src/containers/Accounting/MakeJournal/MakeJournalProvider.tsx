import React, { createContext, useState } from 'react';
import type {
  ManualJournal,
  CreateManualJournalBody,
  EditManualJournalBody,
  AccountsList,
  BranchesListResponse,
  CurrenciesListResponse,
  ContactsAutoCompleteResponse,
} from '@bigcapital/sdk-ts';
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

type MakeJournalFormSubmitPayload = {
  redirect?: boolean;
  resetForm?: boolean;
  publish?: boolean;
};

type MakeJournalFormContextValue = {
  accounts: AccountsList | undefined;
  contacts: ContactsAutoCompleteResponse | undefined;
  currencies: CurrenciesListResponse | undefined;
  manualJournal: ManualJournal | undefined;
  projects: any[] | undefined;
  branches: BranchesListResponse | undefined;

  createJournalMutate: (values: CreateManualJournalBody) => Promise<void>;
  editJournalMutate: (args: [number, EditManualJournalBody]) => Promise<void>;

  isAccountsLoading: boolean;
  isContactsLoading: boolean;
  isCurrenciesLoading: boolean;
  isJournalLoading: boolean;
  isFeatureLoading: boolean;
  isSettingsLoading: boolean;
  isBranchesSuccess: boolean;

  isNewMode: boolean;

  submitPayload: MakeJournalFormSubmitPayload;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<MakeJournalFormSubmitPayload>
  >;
};

const MakeJournalFormContext = createContext<
  MakeJournalFormContextValue | undefined
>(undefined);

type MakeJournalProviderProps = {
  journalId?: number;
  query?: Record<string, any>;
  children?: React.ReactNode;
};

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
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(
    {},
    { enabled: !!isProjectFeatureCan },
  );

  // Submit form payload.
  const [submitPayload, setSubmitPayload] =
    useState<MakeJournalFormSubmitPayload>({});

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isBranchesLoading;

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
