import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import ExpenseViewTabs from 'containers/Expenses/ExpenseViewTabs';
import ExpenseDataTable from 'containers/Expenses/ExpenseDataTable';
import ExpenseActionsBar from 'containers/Expenses/ExpenseActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withExpenses from 'containers/Expenses/withExpenses';
import withExpensesActions from 'containers/Expenses/withExpensesActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

function ExpensesList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  // #withExpenses
  expensesTableQuery,

  //#withExpensesActions
  requestFetchExpensesTable,
  requestDeleteExpense,
  requestPublishExpense,
  requestDeleteBulkExpenses,
  addExpensesTableQueries,
  requestFetchExpense,
}) {
  const history = useHistory();
  const { id } = useParams();
  const { formatMessage } = useIntl();

  const [deleteExpense, setDeleteExpense] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [publishExpense, setPublishExpense] = useState(false);

  const fetchResourceViews = useQuery(
    ['resource-views', 'expenses'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchResourceFields = useQuery(
    ['resource-fields', 'expenses'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  const fetchExpenses = useQuery(['expenses-table', expensesTableQuery], () =>
    requestFetchExpensesTable(),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'expenses_list' }));
  }, [changePageTitle, formatMessage]);

  // Handle delete expense click.
  const handleDeleteExpense = useCallback(
    (expnese) => {
      setDeleteExpense(expnese);
    },
    [setDeleteExpense],
  );

  // Handle cancel expense journal.
  const handleCancelExpenseDelete = useCallback(() => {
    setDeleteExpense(false);
  }, [setDeleteExpense]);

  // Handle confirm delete expense.
  const handleConfirmExpenseDelete = useCallback(() => {
    requestDeleteExpense(deleteExpense.id).then(() => {
      AppToaster.show({
        message: formatMessage(
          { id: 'the_expense_has_been_successfully_deleted' },
          { number: deleteExpense.payment_account_id },
        ),
        intent: Intent.SUCCESS,
      });
      setDeleteExpense(false);
    });
  }, [deleteExpense, requestDeleteExpense, formatMessage]);

  // Calculates the selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  const handleBulkDelete = useCallback(
    (accountsIds) => {
      setBulkDelete(accountsIds);
    },
    [setBulkDelete],
  );

  // Handle confirm journals bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkExpenses(bulkDelete)
      .then(() => {
        AppToaster.show({
          message: formatMessage(
            { id: 'the_expenses_have_been_successfully_deleted' },
            { count: selectedRowsCount },
          ),
          intent: Intent.SUCCESS,
        });
        setBulkDelete(false);
      })
      .catch((error) => {
        setBulkDelete(false);
      });
  }, [requestDeleteBulkExpenses, bulkDelete, formatMessage, selectedRowsCount]);

  // Handle cancel bulk delete alert.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  const handleEidtExpense = useCallback(
    (expense) => {
      history.push(`/expenses/${expense.id}/edit`);
    },
    [history],
  );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, []);

  //   const fetchExpenses = useQuery(['expenses-table', expensesTableQuery], () =>
  //   requestFetchExpensesTable(),
  // );

  const handlePublishExpense = useCallback((expense) => {
    setPublishExpense(expense);
  }, []);

  const handleCancelPublishExpense = useCallback(() => {
    setPublishExpense(false);
  });

  // Handle publish expense confirm.
  const handleConfirmPublishExpense = useCallback(() => {
    requestPublishExpense(publishExpense.id)
      .then(() => {
        setPublishExpense(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_expense_has_been_published',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('expenses-table');
      })
      .catch((error) => {
        setPublishExpense(false);
      });
  }, [publishExpense, requestPublishExpense, formatMessage]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (accounts) => {
      setSelectedRows(accounts);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'expenses'}
    >
      <ExpenseActionsBar
        onBulkDelete={handleBulkDelete}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            // path={[
            //   '/expenses/:custom_view_id/custom_view',
            //   'expenses',
            // ]}
          >
            <ExpenseViewTabs />

            <ExpenseDataTable
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEidtExpense}
              onPublishExpense={handlePublishExpense}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={deleteExpense}
          onCancel={handleCancelExpenseDelete}
          onConfirm={handleConfirmExpenseDelete}
        >
          <p>
            <T id={'once_delete_this_expense_you_will_able_to_restore_it'} />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={
            <T id={'delete_count'} values={{ count: selectedRowsCount }} />
          }
          icon="trash"
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p>
            <T
              id={'once_delete_these_expenses_you_will_not_able_restore_them'}
            />
          </p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'publish'} />}
          intent={Intent.WARNING}
          isOpen={publishExpense}
          onCancel={handleCancelPublishExpense}
          onConfirm={handleConfirmPublishExpense}
        >
          <p>
            <T id={'are_sure_to_publish_this_expense'} />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withExpensesActions,
  withDashboardActions,
  withViewsActions,
  withResourceActions,
  withExpenses(({ expensesTableQuery }) => ({ expensesTableQuery })),
)(ExpensesList);
