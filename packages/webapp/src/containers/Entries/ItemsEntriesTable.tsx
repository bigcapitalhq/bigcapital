// @ts-nocheck
import React, { useCallback } from 'react';
import classNames from 'classnames';

import { CLASSES } from '@/constants/classes';
import { DataTableEditable } from '@/components';

import { useEditableItemsEntriesColumns } from './components';
import {
  useFetchItemRow,
  useComposeRowsOnEditTableCell,
  useComposeRowsOnRemoveTableRow,
  useComposeRowsOnNewRow,
} from './utils';
import {
  ItemEntriesTableProvider,
  useItemEntriesTableContext,
} from './ItemEntriesTableProvider';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { ItemEntry } from '@/interfaces/ItemEntries';

interface ItemsEntriesTableProps {
  initialValue?: ItemEntry;
  value?: ItemEntry[];
  onChange?: (entries: ItemEntry[]) => void;
  taxRates?: any[];
  minLinesNumber?: number;
  enableTaxRates?: boolean;
}

/**
 * Items entries table.
 */
function ItemsEntriesTable(props: ItemsEntriesTableProps) {
  const { value, initialValue, onChange } = props;

  const [localValue, handleChange] = useUncontrolled({
    value,
    initialValue,
    finalValue: [],
    onChange,
  });
  return (
    <ItemEntriesTableProvider value={{ ...props, localValue, handleChange }}>
      <ItemEntriesTableRoot />
    </ItemEntriesTableProvider>
  );
}

/**
 * Items entries table logic.
 * @returns {JSX.Element}
 */
function ItemEntriesTableRoot() {
  const {
    localValue,
    defaultEntry,
    handleChange,
    items,
    errors,
    currencyCode,
    landedCost,
    taxRates,
    itemType,
  } = useItemEntriesTableContext();

  // Editiable items entries columns.
  const columns = useEditableItemsEntriesColumns();

  const composeRowsOnEditCell = useComposeRowsOnEditTableCell();
  const composeRowsOnDeleteRow = useComposeRowsOnRemoveTableRow();
  const composeRowsOnNewRow = useComposeRowsOnNewRow();

  // Handle the fetch item row details.
  const { setItemRow, cellsLoading, isItemFetching } = useFetchItemRow({
    landedCost,
    itemType,
    notifyNewRow: (newRow, rowIndex) => {
      // Update the rate, description and quantity data of the row.
      const newRows = composeRowsOnNewRow(rowIndex, newRow, localValue);
      handleChange(newRows);
    },
  });
  // Handles the editor data update.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      if (columnId === 'item_id') {
        setItemRow({ rowIndex, columnId, itemId: value });
      }
      const newRows = composeRowsOnEditCell(rowIndex, columnId, value);
      handleChange(newRows);
    },
    [localValue, defaultEntry, handleChange],
  );

  // Handle table rows removing by index.
  const handleRemoveRow = (rowIndex) => {
    const newRows = composeRowsOnDeleteRow(rowIndex);
    handleChange(newRows);
  };

  return (
    <DataTableEditable
      className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
      columns={columns}
      data={localValue}
      sticky={true}
      progressBarLoading={isItemFetching}
      cellsLoading={isItemFetching}
      cellsLoadingCoords={cellsLoading}
      payload={{
        items,
        taxRates,
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
  taxRates: [],
  items: [],
  linesNumber: 1,
  minLinesNumber: 1,
  enableTaxRates: true,
};

export default ItemsEntriesTable;
