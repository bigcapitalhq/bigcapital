import { createContext, useContext } from 'react';
import type {
  CreateRecurringJournalBody,
  EditRecurringJournalBody,
} from '@bigcapital/sdk-ts';
import type { ReactNode } from 'react';
import { DashboardInsider } from '@/components';
import { Features } from '@/constants';
import {
  useAccounts,
  useAutoCompleteContacts,
  useBranches,
  useCreateRecurringJournal,
  useCurrencies,
  useEditRecurringJournal,
  useRecurringJournal,
  useSettingsManualJournals,
  useTrackingCategories,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type RecurringJournalFormContextValue = {
  recurringJournal: any;
  accounts: any[];
  contacts: any[];
  currencies: any[];
  branches: any[];
  trackingCategories: any[];
  manualJournalsSettings: any;
  isNewMode: boolean;
  isLoading: boolean;
  createRecurringJournal: (values: CreateRecurringJournalBody) => Promise<any>;
  editRecurringJournal: (
    values: [number, EditRecurringJournalBody],
  ) => Promise<any>;
};

const RecurringJournalFormContext = createContext<
  RecurringJournalFormContextValue | undefined
>(undefined);

export function RecurringJournalFormProvider({
  recurringJournalId,
  children,
}: {
  recurringJournalId?: number;
  children: ReactNode;
}) {
  const { featureCan } = useFeatureCan();
  const isNewMode = !recurringJournalId;
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isTrackingCategoriesFeatureCan = featureCan(
    Features.TrackingCategories,
  );

  const { data: recurringJournal, isLoading: isRecurringJournalLoading } =
    useRecurringJournal(recurringJournalId);
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
  const { data: contacts, isLoading: isContactsLoading } =
    useAutoCompleteContacts();
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();
  const { data: branches, isLoading: isBranchesLoading } = useBranches(
    undefined,
    { enabled: isBranchFeatureCan },
  );
  const { data: trackingCategories, isLoading: isTrackingCategoriesLoading } =
    useTrackingCategories({ enabled: isTrackingCategoriesFeatureCan });
  const { data: manualJournalsSettings, isLoading: isSettingsLoading } =
    useSettingsManualJournals();

  const { mutateAsync: createRecurringJournal, isPending: isCreating } =
    useCreateRecurringJournal();
  const { mutateAsync: editRecurringJournal, isPending: isEditing } =
    useEditRecurringJournal();

  const isLoading =
    (!isNewMode && isRecurringJournalLoading) ||
    isAccountsLoading ||
    isContactsLoading ||
    isCurrenciesLoading ||
    (isBranchFeatureCan && isBranchesLoading) ||
    (isTrackingCategoriesFeatureCan && isTrackingCategoriesLoading) ||
    isSettingsLoading;

  const value: RecurringJournalFormContextValue = {
    recurringJournal,
    accounts: accounts ?? [],
    contacts: contacts ?? [],
    currencies: currencies ?? [],
    branches: branches ?? [],
    trackingCategories: trackingCategories ?? [],
    manualJournalsSettings,
    isNewMode,
    isLoading: isLoading || isCreating || isEditing,
    createRecurringJournal,
    editRecurringJournal,
  };

  return (
    <DashboardInsider loading={isLoading} name={'recurring-journal-form'}>
      <RecurringJournalFormContext.Provider value={value}>
        {children}
      </RecurringJournalFormContext.Provider>
    </DashboardInsider>
  );
}

export function useRecurringJournalFormContext() {
  const ctx = useContext(RecurringJournalFormContext);
  if (!ctx) {
    throw new Error(
      'useRecurringJournalFormContext must be used within RecurringJournalFormProvider',
    );
  }
  return ctx;
}
