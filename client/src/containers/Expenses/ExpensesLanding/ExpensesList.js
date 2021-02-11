import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import 'style/pages/Expense/List.scss';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import ExpenseActionsBar from './ExpenseActionsBar';
import ExpenseViewTabs from './ExpenseViewTabs';
import ExpenseDataTable from './ExpenseDataTable';
import ExpensesAlerts from '../ExpensesAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withExpenses from './withExpenses';

import { compose, transformTableStateToQuery } from 'utils';
import { ExpensesListProvider } from './ExpensesListProvider';

/**
 * Expenses list.
 */
function ExpensesList({
  // #withDashboardActions
  changePageTitle,

  // #withExpenses
  expensesTableState,
}) {
  const { formatMessage } = useIntl();

  // Changes the page title once the page mount.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'expenses_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <ExpensesListProvider
      query={transformTableStateToQuery(expensesTableState)}
    >
      <ExpenseActionsBar />

      <DashboardPageContent>
        <ExpenseViewTabs />
        <ExpenseDataTable />
      </DashboardPageContent>

      <ExpensesAlerts />
    </ExpensesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withExpenses(({ expensesTableState }) => ({ expensesTableState })),
)(ExpensesList);
