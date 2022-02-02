import React from 'react';

import { useWarehouseTransferTableColumns } from '../utils';
import { DataTableEditable } from 'components';
import {
  saveInvoke,
  compose,
  updateTableCell,
  updateMinEntriesLines,
  updateAutoAddNewLine,
  updateRemoveLineByIndex,
  orderingLinesIndexes,
} from 'utils';
/**
 * Warehouse transfer form entries table.
 */
export default function WarehouseTransferFormEntriesTable({
  // #ownProps
  items,
  entries,
  defaultEntry,
  onUpdateData,
  errors,
}) {
  // Retrieve the warehouse transfer table columns.
  const columns = useWarehouseTransferTableColumns();

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(
        // Update auto-adding new line.
        updateAutoAddNewLine(defaultEntry, ['item_id']),
        // Update the row value of the given row index and column id.
        updateTableCell(rowIndex, columnId, value),
      )(entries);

      saveInvoke(onUpdateData, newRows);
    },
    [entries, defaultEntry, onUpdateData],
  );
  // Handles click remove datatable row.
  const handleRemoveRow = React.useCallback(
    (rowIndex) => {
      const newRows = compose(
        // Ensure minimum lines count.
        updateMinEntriesLines(4, defaultEntry),
        // Remove the line by the given index.
        updateRemoveLineByIndex(rowIndex),
      )(entries);

      saveInvoke(onUpdateData, newRows);
    },
    [entries, defaultEntry, onUpdateData],
  );

  return (
    <DataTableEditable
      columns={columns}
      data={entries}
      payload={{
        items,
        errors: errors || [],
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['item_id', 0],
      }}
    />
  );
}
