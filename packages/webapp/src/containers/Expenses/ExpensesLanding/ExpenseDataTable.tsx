import * as FF from 'fp-ts/function';
import { useHistory } from 'react-router-dom';
import { ActionsMenu, useExpensesTableColumns } from './components';
import { ExpensesEmptyStatus } from './ExpensesEmptyStatus';
import { useExpensesListContext } from './ExpensesListProvider';
import { withExpenses } from './withExpenses';
import { withExpensesActions } from './withExpensesActions';
import type { ExpenseTableRow } from './components';
import type { WithExpensesProps } from './withExpenses';
import type { WithExpensesActionsProps } from './withExpensesActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { isSmallTableSize, TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.EXPENSES,
  rowName: 'expense',
  identifierColumn: 'payment_date',
  ActionsMenu,
});

interface ExpensesDataTableProps
  extends WithExpensesActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    Pick<WithExpensesProps, 'expensesTableState' | 'expensesSelectedRows'> {}

/**
 * Expenses datatable.
 */
function ExpensesDataTable({
  // #withExpensesActions
  setExpensesTableState,
  setExpensesSelectedRows,

  // #withDrawerActions
  openDrawer,

  // #withAlertActions
  openAlert,

  // #withExpenses
  expensesTableState,
  expensesSelectedRows,
}: ExpensesDataTableProps) {
  // Expenses list context.
  const {
    expenses,
    pagination,

    isExpensesLoading,
    isExpensesFetching,
    isEmptyStatus,
    expenseSettings,
  } = useExpensesListContext();

  const history = useHistory();

  // Expenses table columns.
  const columns = useExpensesTableColumns();

  // Handle the expense publish action.
  const handlePublishExpense = (expense: ExpenseTableRow) => {
    openAlert('expense-publish', { expenseId: expense.id });
  };

  // Handle the expense edit action.
  const handleEditExpense = ({ id }: ExpenseTableRow) => {
    history.push(`/expenses/${id}/edit`);
  };

  // Handle the expense delete action.
  const handleDeleteExpense = (expense: ExpenseTableRow) => {
    openAlert('expense-delete', { expenseId: expense.id });
  };

  // Handle view detail expense.
  const handleViewDetailExpense = ({ id }: ExpenseTableRow) => {
    openDrawer(DRAWERS.EXPENSE_DETAILS, {
      expenseId: id,
    });
  };

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <ExpensesEmptyStatus />;
  }

  return (
    <Table
      columns={columns}
      data={expenses}
      total={pagination?.total}
      loading={isExpensesLoading}
      fetching={isExpensesFetching}
      compact={isSmallTableSize(expenseSettings?.tableSize)}
      query={expensesTableState}
      setQuery={setExpensesTableState}
      selectedIds={expensesSelectedRows}
      setSelectedIds={setExpensesSelectedRows}
      actions={{
        onPublish: handlePublishExpense,
        onDelete: handleDeleteExpense,
        onEdit: handleEditExpense,
        onViewDetails: handleViewDetailExpense,
      }}
    />
  );
}

export const ExpenseDataTable = FF.pipe(
  ExpensesDataTable,
  withExpenses(({ expensesTableState, expensesSelectedRows }) => ({
    expensesTableState,
    expensesSelectedRows,
  })),
  withExpensesActions,
  withDrawerActions,
  withAlertActions,
  withDashboardActions,
);
