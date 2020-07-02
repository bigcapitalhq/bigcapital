import React, { useEffect, useCallback, useState, useMemo } from 'react';
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
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';

import Icon from 'components/Icon';
import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import { If, Money } from 'components';
import DataTable from 'components/DataTable';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';
import withExpenses from 'containers/Expenses/withExpenses';
import withExpensesActions from 'containers/Expenses/withExpensesActions';

function ExpensesDataTable({
  //#withExpenes
  expensesCurrentPage,
  expensesLoading,
  expensesPagination,
  
  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  // #ownProps
  loading,
  onFetchData,
  onEditExpense,
  onDeleteExpense,
  onPublishExpense,
  onSelectedRowsChange,
}) {
  const { custom_view_id: customViewId } = useParams();
  const [initialMount, setInitialMount] = useState(false);
  const { formatMessage } = useIntl();

  useUpdateEffect(() => {
    if (!expensesLoading) {
      setInitialMount(true);
    }
  }, [expensesLoading, setInitialMount]);

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

  const handlePublishExpense = useCallback(
    (expense) => () => {
      onPublishExpense && onPublishExpense(expense);
    },
    [onPublishExpense],
  );

  const handleEditExpense = useCallback(
    (expense) => () => {
      onEditExpense && onEditExpense(expense);
    },
    [onEditExpense],
  );

  const handleDeleteExpense = useCallback(
    (expense) => () => {
      onDeleteExpense && onDeleteExpense(expense);
    },
    [onDeleteExpense],
  );

  const actionMenuList = useCallback(
    (expense) => (
      <Menu>
        <MenuItem text={formatMessage({ id: 'view_details' })} />
        <MenuDivider />
        <If condition={!expense.published}>
          <MenuItem
            text={formatMessage({ id: 'publish_expense' })}
            onClick={handlePublishExpense(expense)}
          />
        </If>

        <MenuItem
          text={formatMessage({ id: 'edit_expense' })}
          onClick={handleEditExpense(expense)}
        />
        <MenuItem
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
        accessor: () => moment().format('YYYY MMM DD'),
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

  const handleDataTableFetchData = useCallback(
    (...args) => {
      onFetchData && onFetchData(...args);
    },
    [onFetchData],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  return (
    <div>
      <LoadingIndicator loading={loading} mount={false}>
        <DataTable
          columns={columns}
          data={expensesCurrentPage}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          sticky={true}
          loading={expensesLoading}
          onSelectedRowsChange={handleSelectedRowsChange}
          rowContextMenu={onRowContextMenu}
          pagination={true}
          pagesCount={expensesPagination.pagesCount}
          initialPageSize={expensesPagination.pageSize}
          initialPageIndex={expensesPagination.page - 1}
        />
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withDialogActions,
  withDashboardActions,
  withExpensesActions,
  withExpenses(({ expensesCurrentPage, expensesLoading, expensesPagination }) => ({
    expensesCurrentPage,
    expensesLoading,
    expensesPagination,
  })),
  withViewDetails(),
)(ExpensesDataTable);
