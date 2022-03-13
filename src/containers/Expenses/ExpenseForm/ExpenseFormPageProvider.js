import React, { createContext } from 'react';
import { isEqual, isUndefined } from 'lodash';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { Features } from 'common';
import { useFeatureCan } from 'hooks/state';
import {
  useCurrencies,
  useCustomers,
  useExpense,
  useAccounts,
  useBranches,
  useCreateExpense,
  useEditExpense,
} from 'hooks/query';

const ExpenseFormPageContext = createContext();

/**
 * Accounts chart data provider.
 */
function ExpenseFormPageProvider({ query, expenseId, baseCurrency, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

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

  // Create and edit expense mutate.
  const { mutateAsync: createExpenseMutate } = useCreateExpense();
  const { mutateAsync: editExpenseMutate } = useEditExpense();

  // Submit form payload.
  const [submitPayload, setSubmitPayload] = React.useState({});
  const [selectCustomer, setSelectCustomer] = React.useState(null);

  // Detarmines whether the form in new mode.
  const isNewMode = !expenseId;

  // Determines whether the foreign customer.
  const isForeignCustomer =
    !isEqual(selectCustomer?.currency_code, baseCurrency) &&
    !isUndefined(selectCustomer?.currency_code);

  // Provider payload.
  const provider = {
    isNewMode,
    isForeignCustomer,
    expenseId,
    submitPayload,
    selectCustomer,

    currencies,
    customers,
    expense,
    accounts,
    branches,

    isCurrenciesLoading,
    isExpenseLoading,
    isCustomersLoading,
    isAccountsLoading,
    isBranchesSuccess,

    createExpenseMutate,
    editExpenseMutate,
    setSubmitPayload,
    setSelectCustomer,
  };

  return (
    <DashboardInsider
      loading={
        isCurrenciesLoading ||
        isExpenseLoading ||
        isCustomersLoading ||
        isAccountsLoading
      }
      name={'expense-form'}
    >
      <ExpenseFormPageContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useExpenseFormContext = () => React.useContext(ExpenseFormPageContext);

export { ExpenseFormPageProvider, useExpenseFormContext };
