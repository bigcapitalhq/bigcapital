import React, { useEffect } from 'react';

import 'style/pages/Expense/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import ExpenseActionsBar from './ExpenseActionsBar';
import ExpenseViewTabs from './ExpenseViewTabs';
import ExpenseDataTable from './ExpenseDataTable';

import withExpenses from './withExpenses';
import withExpensesActions from './withExpensesActions';

import { compose, transformTableStateToQuery } from 'utils';
import { ExpensesListProvider } from './ExpensesListProvider';

/**
 * Expenses list.
 */
function ExpensesList({
  // #withExpenses
  expensesTableState,
  expensesTableStateChanged,

  // #withExpensesActions
  resetExpensesTableState,
}) {
  // Resets the accounts table state once the page unmount.
  useEffect(
    () => () => {
      resetExpensesTableState();
    },
    [resetExpensesTableState],
  );

  return (
    <ExpensesListProvider
      query={transformTableStateToQuery(expensesTableState)}
      tableStateChanged={expensesTableStateChanged}
    >
      <ExpenseActionsBar />

      <DashboardPageContent>
        <ExpenseViewTabs />
        <ExpenseDataTable />
      </DashboardPageContent>
    </ExpensesListProvider>
  );
}

export default compose(
  withExpenses(({ expensesTableState, expensesTableStateChanged }) => ({
    expensesTableState,
    expensesTableStateChanged,
  })),
  withExpensesActions,
)(ExpensesList);
