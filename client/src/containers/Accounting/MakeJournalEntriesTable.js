import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import { compose, formattedAmount } from 'utils';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
} from 'components/DataTableCells';
import { omit } from 'lodash';

import withAccounts from 'containers/Accounts/withAccounts';
import { FormattedMessage as T, useIntl } from 'react-intl';

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
    <Button
      icon={<Icon icon='times-circle' iconSize={14} />}
      iconSize={14}
      className='ml2'
      minimal={true}
      intent={Intent.DANGER}
      onClick={onClickRemoveRole}
    />
  );
};

// Total text cell renderer.
const TotalAccountCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === props.row.index + 2) {
    return <span>{'Total USD'}</span>;
  }
  return chainedComponent(props);
};

// Total credit/debit cell renderer.
const TotalCreditDebitCellRenderer = (chainedComponent, type) => (props) => {
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

const NoteCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === props.row.index + 2) {
    return '';
  }
  return chainedComponent(props);
};

/**
 * Make journal entries table component.
 */
function MakeJournalEntriesTable({
  formik: { errors, values, setFieldValue },
  accounts,
  onClickRemoveRow,
  onClickAddNewRow,
  defaultRow,
  initialValues,
}) {
  const [rows, setRow] = useState([]);
  const { formatMessage } = useIntl();
  useEffect(() => {
    setRow([
      ...initialValues.entries.map((e) => ({ ...e, rowType: 'editor' })),
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
        'entries',
        newRows.map((row) => ({
          ...omit(row, ['rowType']),
        }))
      );
    },
    [rows, setFieldValue]
  );

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback(
    (rowIndex) => {
      const removeIndex = parseInt(rowIndex, 10);
      const newRows = rows.filter((row, index) => index !== removeIndex);

      setRow([...newRows]);
      setFieldValue(
        'entries',
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row) => ({ ...omit(row, ['rowType']) }))
      );
      onClickRemoveRow && onClickRemoveRow(removeIndex);
    },
    [rows, setFieldValue, onClickRemoveRow]
  );

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
        Header: formatMessage({ id: 'account' }),
        id: 'account_id',
        accessor: 'account_id',
        Cell: TotalAccountCellRenderer(AccountsListFieldCell),
        className: 'account',
        disableSortBy: true,
        disableResizing: true,
        width: 250,
      },
      {
        Header: formatMessage({ id: 'credit_usd' }),
        accessor: 'credit',
        Cell: TotalCreditDebitCellRenderer(MoneyFieldCell, 'credit'),
        className: 'credit',
        disableSortBy: true,
        disableResizing: true,
        width: 150,
      },
      {
        Header: formatMessage({ id: 'debit_usd' }),
        accessor: 'debit',
        Cell: TotalCreditDebitCellRenderer(MoneyFieldCell, 'debit'),
        className: 'debit',
        disableSortBy: true,
        disableResizing: true,
        width: 150,
      },
      {
        Header: formatMessage({ id: 'note' }),
        accessor: 'note',
        Cell: NoteCellRenderer(InputGroupCell),
        disableSortBy: true,
        className: 'note',
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
    []
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
    [rows]
  );

  return (
    <div class='make-journal-entries__table'>
      <DataTable
        columns={columns}
        data={rows}
        rowClassNames={rowClassNames}
        payload={{
          accounts,
          errors: errors.entries || [],
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
        }}
      />

      <div class='mt1'>
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

export default compose(withAccounts)(MakeJournalEntriesTable);
