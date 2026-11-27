import React, { createContext, useMemo, useRef } from 'react';
import { getBudgetAccountRows } from './utils';
import type { BudgetFormContextValue, BudgetFormSubmitPayload } from './types';
import type {
  Account,
  CreateBudgetBody,
  EditBudgetBody,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import {
  useAccounts,
  useBudget,
  useCreateBudget,
  useEditBudget,
  useCurrentOrganization,
} from '@/hooks/query';

const BudgetFormContext = createContext<BudgetFormContextValue | undefined>(
  undefined,
);

interface BudgetFormProviderProps {
  budgetId?: number;
  children?: React.ReactNode;
}

/**
 * Budget form provider.
 */
function BudgetFormProvider({ budgetId, children }: BudgetFormProviderProps) {
  // Fetches the given budget details.
  const { data: budget, isLoading: isBudgetLoading } = useBudget(budgetId, {
    enabled: !!budgetId,
  });

  // Fetches the flat accounts list.
  const { data: accountsData, isLoading: isAccountsLoading } = useAccounts({
    structure: 'flat',
  });

  // Fetches the current organization metadata (fiscal year and date format).
  const { data: organization, isLoading: isOrganizationLoading } =
    useCurrentOrganization();

  // Create and edit budget mutations.
  const { mutateAsync: createBudgetMutate } = useCreateBudget();
  const { mutateAsync: editBudgetMutate } = useEditBudget();

  // Holds the submit button intent once clicked before the form submit.
  const submitPayloadRef = useRef<BudgetFormSubmitPayload>({});
  const setSubmitPayload = (payload: BudgetFormSubmitPayload) => {
    submitPayloadRef.current = payload;
  };
  const getSubmitPayload = () => submitPayloadRef.current;

  const accounts = useMemo<Account[]>(() => accountsData ?? [], [accountsData]);
  const accountRows = useMemo(() => getBudgetAccountRows(accounts), [accounts]);

  const isNewMode = !budgetId;
  const isFormLoading =
    isBudgetLoading || isAccountsLoading || isOrganizationLoading;

  const provider: BudgetFormContextValue = {
    budgetId,
    budget,
    accounts,
    accountRows,
    fiscalYear: organization?.metadata?.fiscalYear,
    isNewMode,
    isFormLoading,
    setSubmitPayload,
    getSubmitPayload,
    createBudgetMutate: createBudgetMutate as (
      values: CreateBudgetBody,
    ) => Promise<unknown>,
    editBudgetMutate: editBudgetMutate as (
      args: [number, EditBudgetBody],
    ) => Promise<unknown>,
  };

  return (
    <BudgetFormContext.Provider value={provider}>
      <DashboardInsider loading={isFormLoading} name={'budget-form'}>
        {children}
      </DashboardInsider>
    </BudgetFormContext.Provider>
  );
}

const useBudgetFormContext = (): BudgetFormContextValue => {
  const ctx = React.useContext(BudgetFormContext);
  if (!ctx) {
    throw new Error(
      'useBudgetFormContext must be used within a BudgetFormProvider',
    );
  }
  return ctx;
};

export { BudgetFormProvider, useBudgetFormContext };
