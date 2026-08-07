import React from 'react';
import { useWarehouseTransferTableColumns } from '../utils';
import { useFetchItemWarehouseQuantity } from './hooks';
import { mutateTableCell, mutateTableRow, deleteTableRow } from './utils';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import type { WarehouseTransferEntry } from './types';
import { DataTableEditable } from '@/components';
import { useDeepCompareEffect } from '@/hooks/utils';
import { saveInvoke } from '@/utils';

interface WarehouseTransferFormEntriesTableProps {
  items: unknown;
  entries: WarehouseTransferEntry[];
  defaultEntry: WarehouseTransferEntry;
  onUpdateData: (entries: WarehouseTransferEntry[]) => void;
  errors?: unknown;

  destinationWarehouseId: number | string;
  sourceWarehouseId: number | string;
}

/**
 * Warehouse transfer form entries table.
 */
export function WarehouseTransferFormEntriesTable({
  // #ownProps
  items,
  entries,
  defaultEntry,
  onUpdateData,
  errors,

  destinationWarehouseId,
  sourceWarehouseId,
}: WarehouseTransferFormEntriesTableProps) {
  // Fetch the table row.
  const { newRowMeta, setTableRow, resetTableRow, cellsLoading } =
    useFetchItemWarehouseQuantity();

  // Warehouse transfer provider context.
  const { isItemsCostFetching } = useWarehouseTransferFormContext();

  // Retrieve the warehouse transfer table columns.
  const columns = useWarehouseTransferTableColumns();

  // Observes the new row meta to call `onUpdateData` callback.
  useDeepCompareEffect(() => {
    if (newRowMeta) {
      const newRow: WarehouseTransferEntry = {
        itemId: newRowMeta.itemId,
        warehouses: newRowMeta.warehouses,
        description: '',
        quantity: '',
        index: 0,
        sourceWarehouse: '',
        destinationWarehouse: '',
      };
      const newRows = mutateTableRow(newRowMeta.rowIndex, newRow, entries);

      saveInvoke(onUpdateData, newRows);
      resetTableRow();
    }
  }, [newRowMeta]);

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex: number, columnId: string, itemId: number) => {
      if (columnId === 'itemId') {
        setTableRow({
          rowIndex,
          columnId,
          itemId,
          sourceWarehouseId,
          destinationWarehouseId,
        });
      }
      const editCell = mutateTableCell(rowIndex, columnId, defaultEntry);
      const newRows = editCell(itemId, entries);

      saveInvoke(onUpdateData, newRows);
    },
    [
      entries,
      defaultEntry,
      onUpdateData,
      destinationWarehouseId,
      sourceWarehouseId,
      setTableRow,
    ],
  );
  // Handles click remove datatable row.
  const handleRemoveRow = React.useCallback(
    (rowIndex: number) => {
      const newRows = deleteTableRow(rowIndex, defaultEntry, entries);
      saveInvoke(onUpdateData, newRows);
    },
    [entries, defaultEntry, onUpdateData],
  );

  return (
    <DataTableEditable
      columns={columns}
      data={entries}
      cellsLoading={!!cellsLoading}
      cellsLoadingCoords={cellsLoading ?? undefined}
      progressBarLoading={isItemsCostFetching || !!cellsLoading}
      payload={{
        items,
        errors: errors || [],
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['itemId', 0],

        sourceWarehouseId,
        destinationWarehouseId,
      }}
    />
  );
}
