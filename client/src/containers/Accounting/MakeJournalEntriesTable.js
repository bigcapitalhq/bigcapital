import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Tooltip, Position, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { omit } from 'lodash';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import DataTable from 'components/DataTable';
import {
  compose,
  formattedAmount,
  transformUpdatedRows,
  saveInvoke,
} from 'utils';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
  ContactsListFieldCell,
} from 'components/DataTableCells';
import {
  ContactHeaderCell,
  ActionsCellRenderer,
  TotalAccountCellRenderer,
  TotalCreditDebitCellRenderer,
  NoteCellRenderer,
} from './components';
import withAccounts from 'containers/Accounts/withAccounts';
import withCustomers from 'containers/Customers/withCustomers';

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
  onChange,
  entries,
  error,
}) {
  const [rows, setRows] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setRows([...entries.map((e) => ({ ...e, rowType: 'editor' }))]);
  }, [entries, setRows]);

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
        sticky: 'left',
      },
      {
        Header: formatMessage({ id: 'account' }),
        id: 'account_id',
        accessor: 'account_id',
        Cell: TotalAccountCellRenderer(AccountsListFieldCell),
        className: 'account',
        disableSortBy: true,
        width: 140,
      },
      {
        Header: formatMessage({ id: 'credit_currency' }, { currency: 'USD' }),
        accessor: 'credit',
        Cell: TotalCreditDebitCellRenderer(MoneyFieldCell, 'credit'),
        className: 'credit',
        disableSortBy: true,
        width: 100,
      },
      {
        Header: formatMessage({ id: 'debit_currency' }, { currency: 'USD' }),
        accessor: 'debit',
        Cell: TotalCreditDebitCellRenderer(MoneyFieldCell, 'debit'),
        className: 'debit',
        disableSortBy: true,
        width: 100,
      },
      {
        Header: ContactHeaderCell,
        id: 'contact_id',
        accessor: 'contact_id',
        Cell: NoteCellRenderer(ContactsListFieldCell),
        className: 'contact',
        disableSortBy: true,
        width: 120,
      },
      {
        Header: formatMessage({ id: 'note' }),
        accessor: 'note',
        Cell: NoteCellRenderer(InputGroupCell),
        disableSortBy: true,
        className: 'note',
        width: 200,
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
  const onClickNewRow = () => {
    saveInvoke(onClickAddNewRow);
  };

  // Handles update datatable data.
  const handleUpdateData = useCallback(
    (rowIndex, columnIdOrObj, value) => {
      const newRows = transformUpdatedRows(
        rows,
        rowIndex,
        columnIdOrObj,
        value,
      );
      saveInvoke(
        onChange,
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row) => ({
            ...omit(row, ['rowType']),
          })),
      );
    },
    [rows, onChange],
  );

  const handleRemoveRow = useCallback(
    (rowIndex) => {
      // Can't continue if there is just one row line or less.
      if (rows.length <= 2) {
        return;
      }
      const removeIndex = parseInt(rowIndex, 10);
      const newRows = rows.filter((row, index) => index !== removeIndex);

      saveInvoke(
        onChange,
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row) => ({ ...omit(row, ['rowType']) })),
      );
      saveInvoke(onClickRemoveRow, removeIndex);
    },
    [rows, onChange, onClickRemoveRow],
  );

  // Rows class names callback.
  const rowClassNames = useCallback(
    (row) => ({
      'row--total': rows.length === row.index + 2,
    }),
    [rows],
  );

  const handleClickClearAllLines = () => {
    saveInvoke(onClickClearAllLines);
  };

  return (
    <div
      className={classNames(
        CLASSES.DATATABLE_EDITOR,
        CLASSES.DATATABLE_EDITOR_HAS_TOTAL_ROW,
      )}
    >
      <DataTable
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        sticky={true}
        payload={{
          accounts: accountsList,
          errors: error,
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
      <div className={classNames(CLASSES.DATATABLE_EDITOR_ACTIONS)}>
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
  withCustomers(({ customers }) => ({
    customers,
  })),
)(MakeJournalEntriesTable);
