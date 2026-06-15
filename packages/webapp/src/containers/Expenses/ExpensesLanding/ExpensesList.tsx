// @ts-nocheck
import React, { useEffect } from 'react';

import '@/style/pages/Expense/List.scss';

import { DashboardPageContent } from '@/components';

import { ExpenseActionsBar } from './ExpenseActionsBar';
import { ExpenseDataTable } from './ExpenseDataTable';

import { withExpenses } from './withExpenses';
import { withExpensesActions } from './withExpensesActions';

import { transformTableStateToQuery } from '@/utils';
import { ExpensesListProvider } from './ExpensesListProvider';
import { flow } from 'fp-ts/function';

/**
 * Expenses list.
 */
function ExpensesListInner({
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
        <ExpenseDataTable />
      </DashboardPageContent>
    </ExpensesListProvider>
  );
}

export const ExpensesList = flow(
  withExpensesActions,
  withExpenses(({ expensesTableState, expensesTableStateChanged }) => ({
    expensesTableState,
    expensesTableStateChanged,
  })),
)(ExpensesListInner);
