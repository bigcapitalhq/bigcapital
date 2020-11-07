import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Tooltip, Position, Intent } from '@blueprintjs/core';
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
  ContactsListFieldCell,
} from 'components/DataTableCells';
import withAccounts from 'containers/Accounts/withAccounts';
import withCustomers from 'containers/Customers/withCustomers';

// Contact header cell.
function ContactHeaderCell() {
  return (
    <>
      <T id={'contact'} />
      <Hint
        content={<T id={'contact_column_hint'} />}
        position={Position.LEFT_BOTTOM}
      />
    </>
  );
}

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
  // #withCustomers
  customers,

  // #withAccounts
  accountsList,

  // #ownPorps
  onClickRemoveRow,
  onClickAddNewRow,
  onClickClearAllLines,
  defaultRow,
  values,
  errors, setFieldValue,
}) {
  const [rows, setRows] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setRows([...values.map((e) => ({ ...e, rowType: 'editor' }))]);
  }, [values, setRows]);

  // Final table rows editor rows and total and final blank row.
  const tableRows = useMemo(
    () => [...rows, { rowType: 'total' }, { rowType: 'final_space' }],
    [rows],
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
        sticky: 'left',
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
        Header: formatMessage({ id: 'credit_currency' }, { currency: 'USD' }),
        accessor: 'credit',
        Cell: TotalCreditDebitCellRenderer(MoneyFieldCell, 'credit'),
        className: 'credit',
        disableSortBy: true,
        disableResizing: true,
        width: 150,
      },
      {
        Header: formatMessage({ id: 'debit_currency' }, { currency: 'USD' }),
        accessor: 'debit',
        Cell: TotalCreditDebitCellRenderer(MoneyFieldCell, 'debit'),
        className: 'debit',
        disableSortBy: true,
        disableResizing: true,
        width: 150,
      },
      {
        Header: ContactHeaderCell,
        id: 'contact_id',
        accessor: 'contact_id',
        Cell: NoteCellRenderer(ContactsListFieldCell),
        className: 'contact',
        disableResizing: true,
        disableSortBy: true,
        width: 200,
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
    [formatMessage],
  );

  // Handles click new line.
  const onClickNewRow = useCallback(() => {
    onClickAddNewRow && onClickAddNewRow();
  }, [defaultRow, rows, onClickAddNewRow]);

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
        'entries',
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row) => ({
            ...omit(row, ['rowType']),
          })),
      );
    },
    [rows, setFieldValue],
  );

  const handleRemoveRow = useCallback(
    (rowIndex) => {
      // Can't continue if there is just one row line or less.
      if (rows.length <= 2) { return; }

      const removeIndex = parseInt(rowIndex, 10);
      const newRows = rows.filter((row, index) => index !== removeIndex);

      setFieldValue(
        'entries',
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row) => ({ ...omit(row, ['rowType']) })),
      );
      onClickRemoveRow && onClickRemoveRow(removeIndex);
    },
    [rows, setFieldValue, onClickRemoveRow],
  );

  // Rows class names callback.
  const rowClassNames = useCallback(
    (row) => ({
      'row--total': rows.length === row.index + 2,
    }),
    [rows],
  );

  const handleClickClearAllLines = () => {
    onClickClearAllLines && onClickClearAllLines();
  };

  return (
    <div class="make-journal-entries__table datatable-editor">
      <DataTable
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        sticky={true}
        payload={{
          accounts: accountsList,
          errors: errors.entries || [],
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
          contacts: [
            ...customers.map((customer) => ({
              ...customer,
              contact_type: 'customer',
            })),
          ],
        }}
      />

      <div class="mt1">
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
  withCustomers(({ customersItems }) => ({
    customers: customersItems,
  })),
)(MakeJournalEntriesTable);
