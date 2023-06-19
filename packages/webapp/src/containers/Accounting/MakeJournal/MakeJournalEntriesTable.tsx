// @ts-nocheck
import React from 'react';
import { DataTableEditable } from '@/components';
import {
  compose,
  saveInvoke,
  updateMinEntriesLines,
  updateRemoveLineByIndex,
  updateAutoAddNewLine,
  updateTableCell,
} from '@/utils';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { useJournalTableEntriesColumns } from './components';
import { updateAdjustEntries } from './utils';

/**
 * Make journal entries table component.
 */
export default function MakeJournalEntriesTable({
  // #ownProps
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
    const newRows = compose(
      // Auto-adding new lines.
      updateAutoAddNewLine(defaultEntry, ['account_id', 'credit', 'debit']),
      // Update items entries total.
      updateAdjustEntries(rowIndex, columnId, value),
      // Update entry of the given row index and column id.
      updateTableCell(rowIndex, columnId, value),
    )(entries);

    saveInvoke(onChange, newRows);
  };

  // Handle remove datatable row.
  const handleRemoveRow = (rowIndex) => {
    const newRows = compose(
      // Ensure minimum lines count.
      updateMinEntriesLines(minLinesNumber, defaultEntry),
      // Remove the line by the given index.
      updateRemoveLineByIndex(rowIndex),
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
