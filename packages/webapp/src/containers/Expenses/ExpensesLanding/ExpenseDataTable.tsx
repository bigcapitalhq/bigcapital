// @ts-nocheck
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from '@/utils';
import { useExpensesListContext } from './ExpensesListProvider';
import { useMemorizedColumnsWidths } from '@/hooks';
import {
  DashboardContentTable,
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { TABLES } from '@/constants/tables';

import ExpensesEmptyStatus from './ExpensesEmptyStatus';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withExpensesActions from './withExpensesActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withSettings from '@/containers/Settings/withSettings';

import { ActionsMenu, useExpensesTableColumns } from './components';
import { DRAWERS } from '@/constants/drawers';

/**
 * Expenses datatable.
 */
function ExpensesDataTable({
  // #withExpensesActions
  setExpensesTableState,

  // #withDrawerActions
  openDrawer,

  // #withAlertsActions
  openAlert,

  // #withSettings
  expensesTableSize,
}) {
  // Expenses list context.
  const {
    expenses,
    pagination,

    isExpensesLoading,
    isExpensesFetching,
    isEmptyStatus,
  } = useExpensesListContext();

  const history = useHistory();

  // Expenses table columns.
  const columns = useExpensesTableColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.EXPENSES);

  // Handle fetch data of manual journals datatable.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      setExpensesTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setExpensesTableState],
  );

  // Handle the expense publish action.
  const handlePublishExpense = (expense) => {
    openAlert('expense-publish', { expenseId: expense.id });
  };

  // Handle the expense edit action.
  const handleEditExpense = ({ id }) => {
    history.push(`/expenses/${id}/edit`);
  };

  // Handle the expense delete action.
  const handleDeleteExpense = (expense) => {
    openAlert('expense-delete', { expenseId: expense.id });
  };

  // Handle view detail expense.
  const handleViewDetailExpense = ({ id }) => {
    openDrawer(DRAWERS.EXPENSE_DETAILS, {
      expenseId: id,
    });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.EXPENSE_DETAILS, { expenseId: cell.row.original.id });
  };

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <ExpensesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={expenses}
        loading={isExpensesLoading}
        headerLoading={isExpensesLoading}
        progressBarLoading={isExpensesFetching}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        onFetchData={handleFetchData}
        pagination={true}
        manualSortBy={true}
        manualPagination={true}
        pagesCount={pagination.pagesCount}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
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

export default compose(
  withDashboardActions,
  withAlertsActions,
  withDrawerActions,
  withExpensesActions,
  withSettings(({ expenseSettings }) => ({
    expensesTableSize: expenseSettings?.tableSize,
  })),
)(ExpensesDataTable);
