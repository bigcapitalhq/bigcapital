import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';
import { useExpensesListContext } from './ExpensesListProvider';

import DataTable from 'components/DataTable';
import ExpensesEmptyStatus from './ExpensesEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withExpensesActions from './withExpensesActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { ActionsMenu, useExpensesTableColumns } from './components';

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

  // Handle fetch data of manual jouranls datatable.
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
    openDrawer('expense-drawer', {
      expenseId: id,
    });
  };

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <ExpensesEmptyStatus />;
  }

  return (
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
      payload={{
        onPublish: handlePublishExpense,
        onDelete: handleDeleteExpense,
        onEdit: handleEditExpense,
        onViewDetails: handleViewDetailExpense,
      }}
    />
  );
}

export default compose(
  withDashboardActions,
  withAlertsActions,
  withDrawerActions,
  withExpensesActions,
)(ExpensesDataTable);
