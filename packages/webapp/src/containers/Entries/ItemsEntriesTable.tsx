// @ts-nocheck
import React, { useEffect, useCallback } from 'react';
import classNames from 'classnames';

import { CLASSES } from '@/constants/classes';
import { DataTableEditable } from '@/components';

import { useEditableItemsEntriesColumns } from './components';
import {
  saveInvoke,
  compose,
  updateMinEntriesLines,
  updateRemoveLineByIndex,
} from '@/utils';
import {
  useFetchItemRow,
  composeRowsOnNewRow,
  composeRowsOnEditCell,
} from './utils';

/**
 * Items entries table.
 */
function ItemsEntriesTable({
  // #ownProps
  items,
  entries,
  initialEntries,
  defaultEntry,
  errors,
  onUpdateData,
  currencyCode,
  itemType, // sellable or purchasable
  landedCost = false,
  minLinesNumber
}) {
  const [rows, setRows] = React.useState(initialEntries);

  // Allows to observes `entries` to make table rows outside controlled.
  useEffect(() => {
    if (entries && entries !== rows) {
      setRows(entries);
    }
  }, [entries, rows]);

  // Editable items entries columns.
  const columns = useEditableItemsEntriesColumns({ landedCost });

  // Handle the fetch item row details.
  const { setItemRow, cellsLoading, isItemFetching } = useFetchItemRow({
    landedCost,
    itemType,
    notifyNewRow: (newRow, rowIndex) => {
      // Update the rate, description and quantity data of the row.
      const newRows = composeRowsOnNewRow(rowIndex, newRow, rows);

      setRows(newRows);
      onUpdateData(newRows);
    },
  });

  // Handles the editor data update.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      if (columnId === 'item_id') {
        setItemRow({ rowIndex, columnId, itemId: value });
      }
      const composeEditCell = composeRowsOnEditCell(rowIndex, columnId);
      const newRows = composeEditCell(value, defaultEntry, rows);

      setRows(newRows);
      onUpdateData(newRows);
    },
    [rows, defaultEntry, onUpdateData, setItemRow],
  );

  // Handle table rows removing by index.
  const handleRemoveRow = (rowIndex) => {
    const newRows = compose(
      // Ensure minimum lines count.
      updateMinEntriesLines(minLinesNumber, defaultEntry),
      // Remove the line by the given index.
      updateRemoveLineByIndex(rowIndex),
    )(rows);

    setRows(newRows);
    saveInvoke(onUpdateData, newRows);
  };

  return (
    <DataTableEditable
      className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
      columns={columns}
      data={rows}
      sticky={true}
      progressBarLoading={isItemFetching}
      cellsLoading={isItemFetching}
      cellsLoadingCoords={cellsLoading}
      payload={{
        items,
        errors: errors || [],
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['item_id', 0],
        currencyCode,
      }}
    />
  );
}

ItemsEntriesTable.defaultProps = {
  defaultEntry: {
    index: 0,
    item_id: '',
    description: '',
    quantity: '',
    rate: '',
    discount: '',
  },
  initialEntries: [],
  linesNumber: 1,
  minLinesNumber: 1,
};

export default ItemsEntriesTable;
