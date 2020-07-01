import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Tooltip, Position, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { omit } from 'lodash';

import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import { Hint } from 'components';
import { compose, formattedAmount } from 'utils';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
  ContactsListFieldCell,
} from 'components/DataTableCells';
import withAccounts from 'containers/Accounts/withAccounts';
import withCustomers from 'containers/Customers/withCustomers';

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
      ...initialValues.entries.map((e) => ({ ...e, rowType: 'editor' })),
      defaultRow,
      defaultRow,
    ]);
  }, [initialValues, defaultRow]);

  // Handles update datatable data.
  const handleUpdateData = useCallback(
    (rowIndex, columnIdOrBulk, value) => {
      const columnId = typeof columnIdOrBulk !== 'object' 
        ? columnIdOrBulk : null;

      const updateTable = typeof columnIdOrBulk === 'object'
        ? columnIdOrBulk : null;

      const newData = updateTable ? updateTable : { [columnId]: value };

      const newRows = rows.map((row, index) => {
        if (index === rowIndex) {
          return { ...rows[rowIndex], ...newData };
        }
        return { ...row };
      });
      setRow(newRows);
      setFieldValue(
        'entries',
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
        'entries',
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row) => ({ ...omit(row, ['rowType']) })),
      );
      onClickRemoveRow && onClickRemoveRow(removeIndex);
    },
    [rows, setFieldValue, onClickRemoveRow],
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
        Header: (
          <>
            <T id={'contact'} />
            <Hint
              content={<T id={'contact_column_hint'} />}
              position={Position.LEFT_BOTTOM}
            />
          </>
        ),
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
    <div class="make-journal-entries__table">
      <DataTable
        columns={columns}
        data={rows}
        rowClassNames={rowClassNames}
        sticky={true}
        payload={{
          accounts,
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
  withCustomers(({ customersItems }) => ({
    customers: customersItems,
  })),
)(MakeJournalEntriesTable);
