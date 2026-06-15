// @ts-nocheck
import React from 'react';
import { DataTableEditable } from '@/components';
import {
  saveInvoke,
  updateMinEntriesLines,
  updateRemoveLineByIndex,
  updateAutoAddNewLine,
  updateTableCell,
} from '@/utils';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { useJournalTableEntriesColumns } from './components';
import { updateAdjustEntries } from './utils';
import { flow } from 'fp-ts/function';

/**
 * Make journal entries table component.
 */
export function MakeJournalEntriesTable({
  // #ownPorps
  onChange,
  entries,
  defaultEntry,
  error,
  initialLinesNumber = 1,
  minLinesNumber = 1,
  currencyCode,
}) {
  const { accounts, contacts, branches, projects } =
    useMakeJournalFormContext();

  // Memorized data table columns.
  const columns = useJournalTableEntriesColumns();

  // Handles update datatable data.
  const handleUpdateData = (rowIndex, columnId, value) => {
    const newRows = flow(
      // Update entry of the given row index and column id.
      updateTableCell(rowIndex, columnId, value),
      // Update items entries total.
      updateAdjustEntries(rowIndex, columnId, value),
      // Auto-adding new lines.
      updateAutoAddNewLine(defaultEntry, ['account_id', 'credit', 'debit']),
    )(entries);

    saveInvoke(onChange, newRows);
  };

  // Handle remove datatable row.
  const handleRemoveRow = (rowIndex) => {
    const newRows = flow(
      // Remove the line by the given index.
      updateRemoveLineByIndex(rowIndex),
      // Ensure minimum lines count.
      updateMinEntriesLines(minLinesNumber, defaultEntry),
    )(entries);

    saveInvoke(onChange, newRows);
  };

  return (
    <DataTableEditable
      columns={columns}
      data={entries}
      sticky={true}
      totalRow={true}
      payload={{
        accounts,
        errors: error,
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        contacts,
        branches,
        projects,
        autoFocus: ['account_id', 0],
        currencyCode,
      }}
    />
  );
}
