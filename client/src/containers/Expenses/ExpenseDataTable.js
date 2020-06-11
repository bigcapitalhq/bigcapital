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

function ExpenseDataTable({
  loading,

  //#withExpenes
  expenses,
  expensesLoading,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  viewMeta,

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
        <MenuItem text={<T id={'view_details'} />} />
        <MenuDivider />
        <If condition={expenses.published}>
          <MenuItem
            text={<T id={'publish_expense'} />}
            onClick={handlePublishExpense(expense)}
          />
        </If>

        <MenuItem
          text={<T id={'edit_expense'} />}
          onClick={handleEditExpense(expense)}
        />
        <MenuItem
          text={<T id={'delete_expense'} />}
          intent={Intent.DANGER}
          onClick={handleDeleteExpense(expense)}
        />
      </Menu>
    ),
    [handleEditExpense, handleDeleteExpense, handlePublishExpense],
  );
  console.log(Object.values(expenses), 'ER');
  
  const columns = useMemo(
    () => [
      {
        id: 'payment_date',
        Header: formatMessage({ id: 'payment_date' }),
        accessor: () => moment().format('YYYY-MM-DD'),
        width: 150,
        className: 'payment_date',
      },
      {
        id: 'beneficiary',
        Header: formatMessage({ id: 'beneficiary' }),
        // accessor: 'beneficiary',
        width: 150,
        className: 'beneficiary',
      },
      {
        id: 'total_amount',
        Header: formatMessage({ id: 'full_amount' }),
        accessor: (r) => <Money amount={r.total_amount} currency={'USD'} />,
        disableResizing: true,
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
        accessor:'expense_account_id',
        width: 150,
        className: 'expense_account',
      },

      {
        id: 'publish',
        Header: formatMessage({ id: 'publish' }),
        accessor: (r) => {
          return !r.published ? (
            <Tag minimal={true}>
              <T id={'published'} />
            </Tag>
          ) : (
            <Tag minimal={true} intent={Intent.WARNING}>
              <T id={'draft'} />
            </Tag>
          );
        },
        disableResizing: true,
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
          data={expenses}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          sticky={true}
          loading={expensesLoading && !initialMount}
          onSelectedRowsChange={handleSelectedRowsChange}
        />
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withDialogActions,
  withDashboardActions,
  withExpensesActions,
  withExpenses(({ expenses, expensesLoading }) => ({
    expenses,
    expensesLoading,
  })),
  withViewDetails,
)(ExpenseDataTable);
