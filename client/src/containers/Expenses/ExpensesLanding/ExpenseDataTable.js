import React, { useCallback } from 'react';
import classNames from 'classnames';

import { compose } from 'utils';

import { useExpensesListContext } from './ExpensesListProvider';

import { Choose } from 'components';
import { CLASSES } from 'common/classes';

import DataTable from 'components/DataTable';
import ExpensesEmptyStatus from './ExpensesEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withExpensesActions from './withExpensesActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { ActionsMenu, useExpensesTableColumns } from './components';

/**
 * Expenses datatable.
 */
function ExpensesDataTable({
  // #withExpensesActions
  setExpensesTableState,

  // #withAlertsActions
  openAlert,
}) {
  // Expenses list context.
  const {
    expenses,
    pagination,

    isExpensesLoading,
    isExpensesFetching,
    isEmptyStatus
  } = useExpensesListContext();

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

  const handleEditExpense = (expense) => {
  };

  // Handle the expense delete action.
  const handleDeleteExpense = (expense) => {
    openAlert('expense-delete', { expenseId: expense.id });
  };

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <Choose>
        <Choose.When condition={isEmptyStatus}>
          <ExpensesEmptyStatus />
        </Choose.When>

        <Choose.Otherwise>
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
              onDelete: handleDeleteExpense
            }}
          />
        </Choose.Otherwise>
      </Choose>
    </div>
  );
}

export default compose(
  withDashboardActions,
  withAlertsActions,
  withExpensesActions,
)(ExpensesDataTable);
