import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import { Hint } from 'components';
import { compose, formattedAmount } from 'utils';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
} from 'components/DataTableCells';
import { omit } from 'lodash';
import withAccounts from 'containers/Accounts/withAccounts';

function ExpenseTable({
  // #withAccounts
  accounts,

  // #ownPorps
  onClickRemoveRow,
  onClickAddNewRow,
  defaultRow,
  initialValues,
  formik: { errors, values, setFieldValue },
}) {
  const [rows, setRow] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setRow([
      ...initialValues.categories.map((e) => ({ ...e, rowType: 'editor' })),
      defaultRow,
      defaultRow,
    ]);
  }, [initialValues, defaultRow]);

  // Handles update datatable data.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = rows.map((row, index) => {
        if (index === rowIndex) {
          return { ...rows[rowIndex], [columnId]: value };
        }
        return { ...row };
      });
      setRow(newRows);
      setFieldValue(
        'categories',
        newRows.map((row) => ({
          ...omit(row, ['rowType']),
        })),
      );
    },
    [rows, setFieldValue],
  );

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback(
    (rowIndex) => {
      const removeIndex = parseInt(rowIndex, 10);
      const newRows = rows.filter((row, index) => index !== removeIndex);

      setRow([...newRows]);
      setFieldValue(
        'categories',
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row) => ({ ...omit(row, ['rowType']) })),
      );
      onClickRemoveRow && onClickRemoveRow(removeIndex);
    },
    [rows, setFieldValue, onClickRemoveRow],
  );

  // Actions cell renderer.
  const ActionsCellRenderer = ({
    row: { index },
    column: { id },
    cell: { value: initialValue },
    data,
    payload,
  }) => {
    if (data.length <= index + 2) {
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
    if (props.data.length === props.row.index + 2) {
      return (
        <span>
          {formatMessage({ id: 'total_currency' }, { currency: 'USD' })}
        </span>
      );
    }
    return chainedComponent(props);
  };

  const NoteCellRenderer = (chainedComponent) => (props) => {
    if (props.data.length === props.row.index + 2) {
      return '';
    }
    return chainedComponent(props);
  };

  const TotalAmountCellRenderer = (chainedComponent, type) => (props) => {
    if (props.data.length === props.row.index + 2) {
      const total = props.data.reduce((total, entry) => {
        const amount = parseInt(entry[type], 10);
        const computed = amount ? total + amount : total;

        return computed;
      }, 0);

      return <span>{formattedAmount(total, 'USD')}</span>;
    }
    return chainedComponent(props);
  };

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
        Header: (<>{ formatMessage({ id: 'expense_category' }) }<Hint /></>),
        id: 'expense_account_id',
        accessor: 'expense_account_id',
        Cell: TotalExpenseCellRenderer(AccountsListFieldCell),
        className: 'expense_account_id',
        disableSortBy: true,
        disableResizing: true,
        width: 250,
      },
      {
        Header: formatMessage({ id: 'amount_currency' }, { currency: 'USD' }),
        accessor: 'amount',
        Cell: TotalAmountCellRenderer(MoneyFieldCell, 'amount'),
        disableSortBy: true,
        disableResizing: true,
        width: 150,
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

  // Handles click new line.
  const onClickNewRow = useCallback(() => {
    setRow([...rows, { ...defaultRow, rowType: 'editor' }]);
    onClickAddNewRow && onClickAddNewRow();
  }, [defaultRow, rows, onClickAddNewRow]);

  const rowClassNames = useCallback(
    (row) => ({
      'row--total': rows.length === row.index + 2,
    }),
    [rows],
  );

  return (
    <div className={'dashboard__insider--expense-form__table'}>
      <DataTable
        columns={columns}
        data={rows}
        rowClassNames={rowClassNames}
        sticky={true}
        payload={{
          accounts,
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
          onClick={onClickNewRow}
        >
          <T id={'clear_all_lines'} />
        </Button>
      </div>
    </div>
  );
}

export default compose(
  withAccounts(({ accounts }) => ({
    accounts,
  })),
)(ExpenseTable);
