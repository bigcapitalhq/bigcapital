import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { omit } from 'lodash';

import { DataTableEditable, Icon } from 'components';
import { Hint } from 'components';
import {
  formattedAmount,
  transformUpdatedRows,
  saveInvoke,
} from 'utils';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
} from 'components/DataTableCells';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { useExpenseFormTableColumns } from './components';


export default function ExpenseTable({
  // #ownPorps
  onClickRemoveRow,
  onClickAddNewRow,
  onClickClearAllLines,

  entries,
  error,
  onChange,
}) {
  const [rows, setRows] = useState([]);
  const { formatMessage } = useIntl();

  const { accounts } = useExpenseFormContext();

  useEffect(() => {
    setRows([...entries.map((e) => ({ ...e, rowType: 'editor' }))]);
  }, [entries]);

  // Final table rows editor rows and total and final blank row.
  const tableRows = useMemo(() => [...rows, { rowType: 'total' }], [rows]);

  // Memorized data table columns.
  const columns = useExpenseFormTableColumns();

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

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback(
    (rowIndex) => {
      // Can't continue if there is just one row line or less.
      if (rows.length <= 1) {
        return;
      }
      const removeIndex = parseInt(rowIndex, 10);
      const newRows = rows.filter((row, index) => index !== removeIndex);

      saveInvoke(
        onChange,
        newRows
          .filter((row) => row.rowType === 'editor')
          .map((row, index) => ({
            ...omit(row, ['rowType']),
            index: index + 1,
          })),
      );
      saveInvoke(onClickRemoveRow, removeIndex);
    },
    [rows, onChange, onClickRemoveRow],
  );

  // Invoke when click on add new line button.
  const onClickNewRow = () => {
    saveInvoke(onClickAddNewRow);
  };
  // Invoke when click on clear all lines button.
  const handleClickClearAllLines = () => {
    saveInvoke(onClickClearAllLines);
  };
  // Rows classnames callback.
  const rowClassNames = useCallback(
    (row) => ({
      'row--total': rows.length === row.index + 1,
    }),
    [rows],
  );

  return (
    <DataTableEditable
      columns={columns}
      data={tableRows}
      rowClassNames={rowClassNames}
      sticky={true}
      payload={{
        accounts: accounts,
        errors: error,
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['expense_account_id', 0],
      }}
      actions={
        <>
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
        </>
      }
      totalRow={true}
    />
  );
} 