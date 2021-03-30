import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useCurrencies,
  useCustomers,
  useExpense,
  useAccounts,
  useCreateExpense,
  useEditExpense,
} from 'hooks/query';

const ExpenseFormPageContext = createContext();

/**
 * Accounts chart data provider.
 */
function ExpenseFormPageProvider({ expenseId, ...props }) {
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  // Fetches customers list.
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers();

  // Fetch the expense details.
  const { data: expense, isLoading: isExpenseLoading } = useExpense(
    expenseId,
    {
      enabled: !!expenseId,
    },
  );

  // Fetch accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Create and edit expense mutate.
  const { mutateAsync: createExpenseMutate } = useCreateExpense();
  const { mutateAsync: editExpenseMutate } = useEditExpense();

  // Submit form payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // 
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

    isCurrenciesLoading,
    isExpenseLoading,
    isCustomersLoading,
    isAccountsLoading,

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
