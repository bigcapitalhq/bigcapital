// @ts-nocheck
import React, { createContext } from 'react';
import { DashboardInsider } from '@/components/Dashboard';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  useCurrencies,
  useCustomers,
  useExpense,
  useAccounts,
  useBranches,
  useCreateExpense,
  useEditExpense,
} from '@/hooks/query';
import { useProjects } from '@/containers/Projects/hooks';

const ExpenseFormPageContext = createContext();

/**
 * Accounts chart data provider.
 */
function ExpenseFormPageProvider({ query, expenseId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  // Fetches customers list.
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers();

  // Fetch the expense details.
  const { data: expense, isLoading: isExpenseLoading } = useExpense(expenseId, {
    enabled: !!expenseId,
  });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetch accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetch the  projects list.
  const {
    data: { projects },
    isLoading: isProjectsLoading,
  } = useProjects({}, { enabled: !!isProjectsFeatureCan });

  // Create and edit expense mutate.
  const { mutateAsync: createExpenseMutate } = useCreateExpense();
  const { mutateAsync: editExpenseMutate } = useEditExpense();

  // Submit form payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Determines whether the form in new mode.
  const isNewMode = !expenseId;

  // Provider payload.
  const provider = {
    isNewMode,
    expenseId,
    submitPayload,

    currencies,
    customers,
    expense,
    accounts,
    branches,
    projects,

    isCurrenciesLoading,
    isExpenseLoading,
    isCustomersLoading,
    isAccountsLoading,
    isBranchesSuccess,

    createExpenseMutate,
    editExpenseMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={
        isCurrenciesLoading ||
        isExpenseLoading ||
        isCustomersLoading ||
        isAccountsLoading ||
        isProjectsLoading
      }
      name={'expense-form'}
    >
      <ExpenseFormPageContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useExpenseFormContext = () => React.useContext(ExpenseFormPageContext);

export { ExpenseFormPageProvider, useExpenseFormContext };
