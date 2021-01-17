import React, { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import ExpenseForm from './ExpenseForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withExpensesActions from 'containers/Expenses/withExpensesActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';
import withCustomersActions from 'containers/Customers/withCustomersActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/Expense/PageForm.scss';

/**
 * Expense page form.
 */
function ExpenseFormPage({
  // #withwithAccountsActions
  requestFetchAccounts,
  requestFetchAccountTypes,

  // #withExpensesActions
  requestFetchExpense,

  // #wihtCurrenciesActions
  requestFetchCurrencies,

  // #withCustomersActions
  requestFetchCustomers,

  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand,
  setDashboardBackLink,
}) {
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    // Shrink the sidebar by foce.
    setSidebarShrink();
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Reset the sidebar to the previous status.
      resetSidebarPreviousExpand();
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [resetSidebarPreviousExpand, setSidebarShrink, setDashboardBackLink]);

  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  const fetchExpense = useQuery(
    ['expense', id],
    (key, _id) => requestFetchExpense(_id),
    { enabled: !!id },
  );

  const fetchCurrencies = useQuery('currencies', () =>
    requestFetchCurrencies(),
  );

  // Handle fetch customers data table or list
  const fetchCustomers = useQuery('customers-table', () =>
    requestFetchCustomers({}),
  );

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/expenses-list');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchExpense.isFetching ||
        fetchAccounts.isFetching ||
        fetchCurrencies.isFetching ||
        fetchCustomers.isFetching
      }
      name={'expense-form'}
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
  withCustomersActions,
  withDashboardActions,
)(ExpenseFormPage);
