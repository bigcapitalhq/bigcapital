import React, {useEffect} from 'react';
import { useAsync } from 'react-use';
import {useParams} from 'react-router-dom';
import Connector from 'connectors/ExpenseForm.connector';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ExpenseForm from 'components/Expenses/ExpenseForm';

function ExpenseFormContainer({
  fetchAccounts,
  fetchCurrencies,
  accounts,
  changePageTitle,
  submitExpense,
  editExpense,
  currencies,
}) {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      changePageTitle('Edit Expense Details');
    } else {
      changePageTitle('New Expense');
    }
  }, []);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchAccounts(),
      fetchCurrencies(),
    ]);
  });
  return (
    <DashboardInsider isLoading={fetchHook.loading} name={'expense-form'}>
      <ExpenseForm {...{submitExpense, editExpense, accounts, currencies} } />
    </DashboardInsider>
  );
}

export default Connector(ExpenseFormContainer);