import React, { useCallback } from 'react';

import { DataTableEditable } from 'components';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { useExpenseFormTableColumns } from './components';
import {
  saveInvoke,
  compose,
  updateTableRow,
  updateMinEntriesLines,
  updateAutoAddNewLine,
  updateRemoveLineByIndex,
  orderingLinesIndexes,
} from 'utils';

/**
 * Expenses form entries.
 */
export default function ExpenseFormEntriesTable({
  // #ownPorps
  entries,
  defaultEntry,
  error,
  onChange,
  currencyCode,
  landedCost = true,
}) {
  // Expense form context.
  const { accounts } = useExpenseFormContext();

  // Memorized data table columns.
  const columns = useExpenseFormTableColumns({ landedCost });

  // Handles update datatable data.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(
        // Update auto-adding new line.
        updateAutoAddNewLine(defaultEntry, ['expense_account_id']),
        // Update the row value of the given row index and column id.
        updateTableRow(rowIndex, columnId, value),
      )(entries);

      saveInvoke(onChange, newRows);
    },
    [entries, defaultEntry, onChange],
  );

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback(
    (rowIndex) => {
      const newRows = compose(
        // Ensure minimum lines count.
        updateMinEntriesLines(4, defaultEntry),
        // Remove the line by the given index.
        updateRemoveLineByIndex(rowIndex),
      )(entries);

      saveInvoke(onChange, newRows);
    },
    [entries, defaultEntry, onChange],
  );

  return (
    <DataTableEditable
      name={'expense-form'}
      columns={columns}
      data={entries}
      sticky={true}
      payload={{
        accounts: accounts,
        errors: error,
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['expense_account_id', 0],
        currencyCode
      }}
      footer={true}
    />
  );
}