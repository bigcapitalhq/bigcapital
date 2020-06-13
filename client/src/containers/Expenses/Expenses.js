import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import ExpenseForm from './ExpenseForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withExpensesActions from 'containers/Expenses/withExpensesActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

function Expenses({
  //#withwithAccountsActions
  requestFetchAccounts,

  //#withExpensesActions
  requestFetchExpense,
  // #wihtCurrenciesActions
  requestFetchCurrencies,
}) {
  const history = useHistory();
  const { id } = useParams();

  const fetchAccounts = useQuery('accounts-expense-list', (key) =>
    requestFetchAccounts(),
  );

  const fetchExpense = useQuery(id && ['expense', id], (key, expense_Id) =>
    requestFetchExpense(expense_Id),
  );

  const fetchCurrencies = useQuery('currencies-expense-list', () =>
    requestFetchCurrencies(),
  );
  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/expenses-list');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.push('/expenses-list');
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchExpense.isFetching ||
        fetchAccounts.isFetching ||
        fetchCurrencies.isFetching
      }
    >
      <ExpenseForm
        onFormSubmit={handleFormSubmit}
        expenseId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withAccountsActions,
  withCurrenciesActions,
  withExpensesActions,
)(Expenses);
