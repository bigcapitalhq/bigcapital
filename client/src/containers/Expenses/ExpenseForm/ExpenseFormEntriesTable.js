import React, { useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

import { DataTableEditable } from 'components';
import ExpenseDeleteEntriesAlert from 'containers/Alerts/Expenses/ExpenseDeleteEntriesAlert';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { useExpenseFormTableColumns } from './components';

import withAlertActions from 'containers/Alert/withAlertActions';

import { transformUpdatedRows, compose, saveInvoke, repeatValue } from 'utils';

/**
 * Expenses form entries.
 */
function ExpenseFormEntriesTable({
  // #withAlertActions
  openAlert,

  // #ownPorps
  entries,
  defaultEntry,
  error,
  onChange,
}) {
  // Expense form context.
  const { accounts } = useExpenseFormContext();

  // Memorized data table columns.
  const columns = useExpenseFormTableColumns();

  // Handles update datatable data.
  const handleUpdateData = useCallback(
    (rowIndex, columnIdOrObj, value) => {
      const newRows = transformUpdatedRows(
        entries,
        rowIndex,
        columnIdOrObj,
        value,
      );
      saveInvoke(onChange, newRows);
    },
    [entries, onChange],
  );

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback(
    (rowIndex) => {
      // Can't continue if there is just one row line or less.
      if (entries.length <= 1) {
        return;
      }
      const newRows = entries.filter((row, index) => index !== rowIndex);
      saveInvoke(onChange, newRows);
    },
    [entries, onChange],
  );

  return (
    <DataTableEditable
      columns={columns}
      data={entries}
      sticky={true}
      payload={{
        accounts: accounts,
        errors: error,
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['expense_account_id', 0],
      }}
      footer={true}
    />
  );
}

export default compose(withAlertActions)(ExpenseFormEntriesTable);
