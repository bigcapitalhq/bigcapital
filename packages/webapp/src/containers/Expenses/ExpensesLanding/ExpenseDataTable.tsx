import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ActionsMenu, useExpensesTableColumns } from './components';
import { InvoicesEmptyStatus as ExpensesEmptyStatus } from './ExpensesEmptyStatus';
import { useExpensesListContext } from './ExpensesListProvider';
import { withExpenses } from './withExpenses';
import { withExpensesActions } from './withExpensesActions';
import type { ExpenseTableRow } from './components';
import type { WithExpensesProps } from './withExpenses';
import type { WithExpensesActionsProps } from './withExpensesActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  DashboardContentTable,
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface ExpensesDataTableProps
  extends WithExpensesActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    Pick<WithExpensesProps, 'expensesTableState'> {}

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
  const expensesTableSize = expenseSettings?.tableSize as string | undefined;

  const history = useHistory();

  // Expenses table columns.
  const columns = useExpensesTableColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.EXPENSES);

  // Handle fetch data of manual jouranls datatable.
  const handleFetchData = useCallback(
    ({
      pageIndex,
      pageSize,
      sortBy,
    }: {
      pageIndex: number;
      pageSize: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setExpensesTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setExpensesTableState],
  );

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

  // Handle cell click.
  const handleCellClick = (
    cell: { row: { original: ExpenseTableRow } },
    _event: React.MouseEvent,
  ) => {
    openDrawer(DRAWERS.EXPENSE_DETAILS, { expenseId: cell.row.original.id });
  };

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (selectedFlatRows: Array<{ original: ExpenseTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setExpensesSelectedRows(selectedIds);
    },
    [setExpensesSelectedRows],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <ExpensesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={expenses || []}
        loading={isExpensesLoading}
        headerLoading={isExpensesLoading}
        progressBarLoading={isExpensesFetching}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        rowTestId={'expense-row'}
        onFetchData={handleFetchData}
        pagination={true}
        initialPageSize={expensesTableState?.pageSize ?? 10}
        manualSortBy={true}
        manualPagination={true}
        rowsCount={pagination?.total ?? 0}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        onSelectedRowsChange={handleSelectedRowsChange}
        size={expensesTableSize}
        payload={{
          onPublish: handlePublishExpense,
          onDelete: handleDeleteExpense,
          onEdit: handleEditExpense,
          onViewDetails: handleViewDetailExpense,
        }}
      />
    </DashboardContentTable>
  );
}

export const ExpenseDataTable = compose(
  withDashboardActions,
  withAlertActions,
  withDrawerActions,
  withExpensesActions,
  withExpenses(({ expensesTableState }) => ({ expensesTableState })),
)(ExpensesDataTable);
