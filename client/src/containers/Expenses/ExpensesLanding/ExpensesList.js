import React from 'react';

import 'style/pages/Expense/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import ExpenseActionsBar from './ExpenseActionsBar';
import ExpenseViewTabs from './ExpenseViewTabs';
import ExpenseDataTable from './ExpenseDataTable';
import ExpensesAlerts from '../ExpensesAlerts';

import withExpenses from './withExpenses';

import { compose, transformTableStateToQuery } from 'utils';
import { ExpensesListProvider } from './ExpensesListProvider';

/**
 * Expenses list.
 */
function ExpensesList({
  // #withExpenses
  expensesTableState,
}) {
  return (
    <ExpensesListProvider
      query={transformTableStateToQuery(expensesTableState)}
    >
      <ExpenseActionsBar />

      <DashboardPageContent>
        <ExpenseViewTabs />

        <DashboardContentTable>
          <ExpenseDataTable />
        </DashboardContentTable>
      </DashboardPageContent>

      <ExpensesAlerts />
    </ExpensesListProvider>
  );
}

export default compose(
  withExpenses(({ expensesTableState }) => ({ expensesTableState })),
)(ExpensesList);
