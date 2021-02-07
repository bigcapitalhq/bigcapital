import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import ExpenseActionsBar from 'containers/Expenses/ExpenseActionsBar';
import ExpensesViewPage from './ExpensesViewPage';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withExpenses from 'containers/Expenses/withExpenses';

import { compose } from 'utils';
import { ExpensesListProvider } from './ExpensesListProvider';

/**
 * Expenses list.
 */
function ExpensesList({
  // #withDashboardActions
  changePageTitle,

  // #withExpenses
  expensesTableQuery,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'expenses_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <ExpensesListProvider query={expensesTableQuery}>
      <ExpenseActionsBar />

      <DashboardPageContent>
        <ExpensesViewPage />
      </DashboardPageContent>
    </ExpensesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withExpenses(({ expensesTableQuery }) => ({ expensesTableQuery })),
)(ExpensesList);
