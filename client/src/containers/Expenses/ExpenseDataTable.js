import React, { useEffect, useCallback, useMemo } from 'react';
import {
  Intent,
  Button,
  Classes,
  Popover,
  Tooltip,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Tag,
} from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';

import Icon from 'components/Icon';
import { compose, saveInvoke } from 'utils';
import { useIsValuePassed } from 'hooks';

import { If, Money, Choose, LoadingIndicator } from 'components';
import { CLASSES } from 'common/classes';

import DataTable from 'components/DataTable';
import ExpensesEmptyStatus from './ExpensesEmptyStatus';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';
import withExpenses from 'containers/Expenses/withExpenses';
import withExpensesActions from 'containers/Expenses/withExpensesActions';
import withCurrentView from 'containers/Views/withCurrentView';

function ExpensesDataTable({
  // #withExpenes
  expensesCurrentPage,
  expensesLoading,
  expensesPagination,
  expensesTableQuery,
  expensesCurrentViewId,

  // #withExpensesActions
  addExpensesTableQueries,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  // #ownProps
  onEditExpense,
  onDeleteExpense,
  onPublishExpense,
  onSelectedRowsChange,
}) {
  const { custom_view_id: customViewId } = useParams();
  const isLoadedBefore = useIsValuePassed(expensesLoading, false);

  const { formatMessage } = useIntl();

  useEffect(() => {
    if (customViewId) {
      changeCurrentView(customViewId);
      setTopbarEditView(customViewId);
    }
    changePageSubtitle(customViewId && viewMeta ? viewMeta.name : '');
  }, [
    customViewId,
    changeCurrentView,
    changePageSubtitle,
    setTopbarEditView,
    viewMeta,
  ]);

  // Handle fetch data of manual jouranls datatable.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addExpensesTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
        page_size: pageSize,
        page: pageIndex + 1,
      });
    },
    [addExpensesTableQueries],
  );

  const handlePublishExpense = useCallback(
    (expense) => () => {
      saveInvoke(onPublishExpense, expense);
    },
    [onPublishExpense],
  );

  const handleEditExpense = useCallback(
    (expense) => () => {
      saveInvoke(onEditExpense, expense);
    },
    [onEditExpense],
  );

  const handleDeleteExpense = useCallback(
    (expense) => () => {
      saveInvoke(onDeleteExpense, expense);
    },
    [onDeleteExpense],
  );

  const actionMenuList = useCallback(
    (expense) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <If condition={!expense.published}>
          <MenuItem
            text={formatMessage({ id: 'publish_expense' })}
            onClick={handlePublishExpense(expense)}
          />
        </If>

        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_expense' })}
          onClick={handleEditExpense(expense)}
        />
        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={formatMessage({ id: 'delete_expense' })}
          intent={Intent.DANGER}
          onClick={handleDeleteExpense(expense)}
        />
      </Menu>
    ),
    [
      handleEditExpense,
      handleDeleteExpense,
      handlePublishExpense,
      formatMessage,
    ],
  );

  const onRowContextMenu = useCallback(
    (cell) => {
      return actionMenuList(cell.row.original);
    },
    [actionMenuList],
  );

  const expenseAccountAccessor = (_expense) => {
    if (_expense.categories.length === 1) {
      return _expense.categories[0].expense_account.name;
    } else if (_expense.categories.length > 1) {
      const mutliCategories = _expense.categories.map((category) => (
        <div>
          - {category.expense_account.name} ${category.amount}
        </div>
      ));
      return (
        <Tooltip content={mutliCategories}>{'- Multi Categories -'}</Tooltip>
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'payment_date',
        Header: formatMessage({ id: 'payment_date' }),
        accessor: (r) => moment(r.payment_date).format('YYYY MMM DD'),
        width: 140,
        className: 'payment_date',
      },
      {
        id: 'total_amount',
        Header: formatMessage({ id: 'full_amount' }),
        accessor: (r) => <Money amount={r.total_amount} currency={'USD'} />,
        className: 'total_amount',
        width: 150,
      },
      {
        id: 'payment_account_id',
        Header: formatMessage({ id: 'payment_account' }),
        accessor: 'payment_account.name',
        className: 'payment_account',
        width: 150,
      },
      {
        id: 'expense_account_id',
        Header: formatMessage({ id: 'expense_account' }),
        accessor: expenseAccountAccessor,
        width: 160,
        className: 'expense_account',
      },
      {
        id: 'publish',
        Header: formatMessage({ id: 'publish' }),
        accessor: (r) => {
          return r.published ? (
            <Tag minimal={true}>
              <T id={'published'} />
            </Tag>
          ) : (
            <Tag minimal={true} intent={Intent.WARNING}>
              <T id={'draft'} />
            </Tag>
          );
        },
        width: 100,
        className: 'publish',
      },
      {
        id: 'description',
        Header: formatMessage({ id: 'description' }),
        accessor: (row) => (
          <If condition={row.description}>
            <Tooltip
              className={Classes.TOOLTIP_INDICATOR}
              content={row.description}
              position={Position.TOP}
              hoverOpenDelay={250}
            >
              <Icon icon={'file-alt'} iconSize={16} />
            </Tooltip>
          </If>
        ),
        disableSorting: true,
        width: 150,
        className: 'description',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_BOTTOM}
          >
            <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      saveInvoke(
        onSelectedRowsChange,
        selectedRows.map((s) => s.original),
      );
    },
    [onSelectedRowsChange],
  );

  const showEmptyStatus = [
    expensesCurrentViewId === -1,
    expensesCurrentPage.length === 0,
  ].every((condition) => condition === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator loading={expensesLoading && !isLoadedBefore}>
        <Choose>
          <Choose.When condition={showEmptyStatus}>
            <ExpensesEmptyStatus />
          </Choose.When>

          <Choose.Otherwise>
            <DataTable
              columns={columns}
              data={expensesCurrentPage}
              manualSortBy={true}
              selectionColumn={true}
              noInitialFetch={true}
              sticky={true}
              onSelectedRowsChange={handleSelectedRowsChange}
              onFetchData={handleFetchData}
              rowContextMenu={onRowContextMenu}
              pagination={true}
              pagesCount={expensesPagination.pagesCount}
              autoResetSortBy={false}
              autoResetPage={false}
              initialPageSize={expensesTableQuery.page_size}
              initialPageIndex={expensesTableQuery.page - 1}
            />
          </Choose.Otherwise>
        </Choose>
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withRouter,
  withCurrentView,
  withDialogActions,
  withDashboardActions,
  withExpensesActions,
  withExpenses(
    ({
      expensesCurrentPage,
      expensesLoading,
      expensesPagination,
      expensesTableQuery,
      expensesCurrentViewId,
    }) => ({
      expensesCurrentPage,
      expensesLoading,
      expensesPagination,
      expensesTableQuery,
      expensesCurrentViewId,
    }),
  ),
  withViewDetails(),
)(ExpensesDataTable);
