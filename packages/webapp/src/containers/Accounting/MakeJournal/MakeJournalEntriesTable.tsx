import React from 'react';
import { useJournalTableEntriesColumns } from './components';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { updateAdjustEntries, type MakeJournalEntry } from './utils';
import { DataTableEditable } from '@/components';
import {
  compose,
  saveInvoke,
  updateMinEntriesLines,
  updateRemoveLineByIndex,
  updateAutoAddNewLine,
  updateTableCell,
} from '@/utils';

type MakeJournalEntriesTableProps = {
  onChange?: (entries: MakeJournalEntry[]) => void;
  entries: MakeJournalEntry[];
  defaultEntry: MakeJournalEntry;
  error?: unknown;
  initialLinesNumber?: number;
  minLinesNumber?: number;
  currencyCode?: string;
};

/**
 * Make journal entries table component.
 */
export function MakeJournalEntriesTable({
  onChange,
  entries,
  defaultEntry,
  error,
  initialLinesNumber = 1,
  minLinesNumber = 1,
  currencyCode,
}: MakeJournalEntriesTableProps) {
  const { accounts, contacts, branches, projects } =
    useMakeJournalFormContext();

  // Memorized data table columns.
  const columns = useJournalTableEntriesColumns();

  // Handles update datatable data.
  const handleUpdateData = (
    rowIndex: number,
    columnId: string,
    value: string | number,
  ) => {
    const newRows: MakeJournalEntry[] = compose(
      // Auto-adding new lines.
      updateAutoAddNewLine(defaultEntry, ['accountId', 'credit', 'debit']),
      // Update journal entries total.
      updateAdjustEntries(rowIndex, columnId, value),
      // Update entry of the given row index and column id.
      updateTableCell(rowIndex, columnId, value),
    )(entries);

    saveInvoke(onChange, newRows);
  };

  // Handle remove datatable row.
  const handleRemoveRow = (rowIndex: number) => {
    const newRows: MakeJournalEntry[] = compose(
      // Ensure minimum lines count.
      updateMinEntriesLines(minLinesNumber, defaultEntry),
      // Remove the line by the given index.
      updateRemoveLineByIndex(rowIndex),
    )(entries);

    saveInvoke(onChange, newRows);
  };

  return (
    // @ts-expect-error DataTableEditable is untyped and infers required actions/name props that are unused at runtime
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
        autoFocus: ['accountId', 0],
        currencyCode,
      }}
    />
  );
}
