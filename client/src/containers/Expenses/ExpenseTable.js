import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { omit } from 'lodash';

import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import { Hint } from 'components';
import { compose, formattedAmount, transformUpdatedRows } from 'utils';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
} from 'components/DataTableCells';
import withAccounts from 'containers/Accounts/withAccounts';

const ExpenseCategoryHeaderCell = () => {
  return (
    <>
      <T id={'expense_category'} />
      <Hint />
    </>
  );
};

// Actions cell renderer.
const ActionsCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  data,
  payload,
}) => {
  if (data.length <= index + 1) {
    return '';
  }
  const onClickRemoveRole = () => {
    payload.removeRow(index);
  };
  return (
    <Tooltip content={<T id={'remove_the_line'} />} position={Position.LEFT}>
      <Button
        icon={<Icon icon="times-circle" iconSize={14} />}
        iconSize={14}
        className="ml2"
        minimal={true}
        intent={Intent.DANGER}
        onClick={onClickRemoveRole}
      />
    </Tooltip>
  );
};

// Total text cell renderer.
const TotalExpenseCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length <= props.row.index + 1) {
    return (
      <span>
        <T id={'total_currency'} values={{ currency: 'USD' }} />
      </span>
    );
  }
  return chainedComponent(props);
};

const NoteCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return '';
  }
  return chainedComponent(props);
};

const TotalAmountCellRenderer = (chainedComponent, type) => (props) => {
  if (props.data.length === props.row.index + 1) {
    const total = props.data.reduce((total, entry) => {
      const amount = parseInt(entry[type], 10);
      const computed = amount ? total + amount : total;

      return computed;
    }, 0);

    return <span>{formattedAmount(total, 'USD')}</span>;
  }
  return chainedComponent(props);
};

function ExpenseTable({
  // #withAccounts
  accountsList,

  // #ownPorps
  onClickRemoveRow,
  onClickAddNewRow,
  onClickClearAllLines,
  defaultRow,
  categories,
  errors,
  setFieldValue,
}) {
  const [rows, setRows] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setRows([...categories.map((e) => ({ ...e, rowType: 'editor' }))]);
  }, [categories]);

  // Final table rows editor rows and total and final blank row.
  const tableRows = useMemo(() => [...rows, { rowType: 'total' }], [rows]);

  // Memorized data table columns.
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: ({ row: { index } }) => <span>{index + 1}</span>,
        className: 'index',
        width: 40,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        Header: ExpenseCategoryHeaderCell,
        id: 'expense_account_id',
        accessor: 'expense_account_id',
        Cell: TotalExpenseCellRenderer(AccountsListFieldCell),
        className: 'expense_account_id',
        disableSortBy: true,
        disableResizing: true,
        width: 250,
        filterAccountsByRootType: ['expense'],
      },
      {
        Header: formatMessage({ id: 'amount_currency' }, { currency: 'USD' }),
        accessor: 'amount',
        Cell: TotalAmountCellRenderer(MoneyFieldCell, 'amount'),
        disableSortBy: true,
        disableResizing: true,
        width: 180,
        className: 'amount',
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'description',
        Cell: NoteCellRenderer(InputGroupCell),
        disableSortBy: true,
        className: 'description',
      },
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        className: 'actions',
        disableSortBy: true,
        disableResizing: true,
        width: 45,
      },
    ],
    [formatMessage],
  );

  // Handles update datatable data.
  const handleUpdateData = useCallback(
    (rowIndex, columnIdOrObj, value) => {
      const newRows = transformUpdatedRows(
        rows,
        rowIndex,
        columnIdOrObj,
        value,
      );
      setFieldValue(
        'categories',
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row) => ({
            ...omit(row, ['rowType']),
          })),
      );
    },
    [rows, setFieldValue],
  );

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback(
    (rowIndex) => {
      // Can't continue if there is just one row line or less.
      if (rows.length <= 1) {
        return;
      }

      const removeIndex = parseInt(rowIndex, 10);
      const newRows = rows.filter((row, index) => index !== removeIndex);

      setFieldValue(
        'categories',
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row, index) => ({
            ...omit(row, ['rowType']),
            index: index + 1,
          })),
      );
      onClickRemoveRow && onClickRemoveRow(removeIndex);
    },
    [rows, setFieldValue, onClickRemoveRow],
  );

  // Invoke when click on add new line button.
  const onClickNewRow = () => {
    onClickAddNewRow && onClickAddNewRow();
  };
  // Invoke when click on clear all lines button.
  const handleClickClearAllLines = () => {
    onClickClearAllLines && onClickClearAllLines();
  };
  // Rows classnames callback.
  const rowClassNames = useCallback(
    (row) => ({
      'row--total': rows.length === row.index + 1,
    }),
    [rows],
  );

  return (
    <div className={'dashboard__insider--expense-form__table'}>
      <DataTable
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        sticky={true}
        payload={{
          accounts: accountsList,
          errors: errors.categories || [],
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
        }}
      />
      <div className={'mt1'}>
        <Button
          small={true}
          className={'button--secondary button--new-line'}
          onClick={onClickNewRow}
        >
          <T id={'new_lines'} />
        </Button>

        <Button
          small={true}
          className={'button--secondary button--clear-lines ml1'}
          onClick={handleClickClearAllLines}
        >
          <T id={'clear_all_lines'} />
        </Button>
      </div>
    </div>
  );
}

export default compose(
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
)(ExpenseTable);
