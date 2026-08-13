import React, { useEffect } from 'react';

import '@/style/pages/Expense/List.scss';
import { ExpenseActionsBar } from './ExpenseActionsBar';
import { ExpenseDataTable } from './ExpenseDataTable';
import { ExpensesListDialogs } from './ExpensesListDialogs';
import { ExpensesListDrawers } from './ExpensesListDrawers';
import { ExpensesListProvider } from './ExpensesListProvider';
import { withExpenses } from './withExpenses';
import { withExpensesActions } from './withExpensesActions';
import type { WithExpensesProps } from './withExpenses';
import type { WithExpensesActionsProps } from './withExpensesActions';
import { DashboardPageContent } from '@/components';
import { compose, transformTableStateToQuery } from '@/utils';

interface ExpensesListInnerProps
  extends Pick<
      WithExpensesProps,
      'expensesTableState' | 'expensesTableStateChanged'
    >,
    Pick<
      WithExpensesActionsProps,
      'resetExpensesTableState' | 'resetExpensesSelectedRows'
    > {}

/**
 * Expenses list.
 */
function ExpensesListInner({
  // #withExpenses
  expensesTableState,
  expensesTableStateChanged,

  // #withExpensesActions
  resetExpensesTableState,
  resetExpensesSelectedRows,
}: ExpensesListInnerProps) {
  // Resets the expenses table state and selected rows once the page unmount.
  useEffect(
    () => () => {
      resetExpensesTableState();
      resetExpensesSelectedRows();
    },
    [resetExpensesSelectedRows, resetExpensesTableState],
  );

  return (
    <ExpensesListProvider
      query={transformTableStateToQuery(expensesTableState)}
      tableStateChanged={expensesTableStateChanged}
    >
      <ExpenseActionsBar />
      <ExpensesListDrawers />
      <ExpensesListDialogs />

      <DashboardPageContent>
        <ExpenseDataTable />
      </DashboardPageContent>
    </ExpensesListProvider>
  );
}

export const ExpensesList = compose(
  withExpenses(({ expensesTableState, expensesTableStateChanged }) => ({
    expensesTableState,
    expensesTableStateChanged,
  })),
  withExpensesActions,
)(ExpensesListInner);
