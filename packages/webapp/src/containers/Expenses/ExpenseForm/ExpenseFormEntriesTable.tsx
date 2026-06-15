// @ts-nocheck
import React, { useCallback } from 'react';

import { DataTableEditable } from '@/components';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { useExpenseFormTableColumns } from './components';
import {
  saveInvoke,
  updateTableCell,
  updateMinEntriesLines,
  updateAutoAddNewLine,
  updateRemoveLineByIndex,
} from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Expenses form entries.
 */
export function ExpenseFormEntriesTable({
  // #ownPorps
  entries,
  defaultEntry,
  error,
  onChange,
  currencyCode,
  landedCost = true,
  minLines,
}) {
  // Expense form context.
  const { accounts, projects } = useExpenseFormContext();

  // Memorized data table columns.
  const columns = useExpenseFormTableColumns({ landedCost });

  // Handles update datatable data.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = flow(
        // Update the row value of the given row index and column id.
        updateTableCell(rowIndex, columnId, value),
        // Update auto-adding new line.
        updateAutoAddNewLine(defaultEntry, ['expense_account_id']),
      )(entries);

      saveInvoke(onChange, newRows);
    },
    [entries, defaultEntry, onChange],
  );

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback(
    (rowIndex) => {
      const newRows = flow(
        // Remove the line by the given index.
        updateRemoveLineByIndex(rowIndex),
        // Ensure minimum lines count.
        updateMinEntriesLines(minLines, defaultEntry),
      )(entries);

      saveInvoke(onChange, newRows);
    },
    [minLines, entries, defaultEntry, onChange],
  );

  return (
    <DataTableEditable
      name={'expense-form'}
      columns={columns}
      data={entries}
      sticky={true}
      payload={{
        accounts: accounts,
        projects: projects,
        errors: error,
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['expense_account_id', 0],
        currencyCode,
      }}
    />
  );
}

ExpenseFormEntriesTable.defaultProps = {
  minLines: 1,
};
