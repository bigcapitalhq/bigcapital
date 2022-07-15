// @ts-nocheck
import React from 'react';
import { useItem } from '@/hooks/query';

interface IItemMeta {
  rowIndex: number;
  columnId: string;
  itemId: number;

  sourceWarehouseId: number;
  distentionWarehouseId: number;
}

type CellLoading = any;

interface IWarehouseMeta {
  warehouseId: number;
  warehouseQuantity: number;
  warehouseQuantityFormatted: string;
}
interface IRow {
  rowIndex: number;
  columnId: number;
  itemId: number;

  warehouses: IWarehouseMeta[];
}

/**
 * Fetches the item warehouse quantity.
 * @returns
 */
export const useFetchItemWarehouseQuantity = () => {
  // Holds the table row meta of the given row index.
  const [tableRow, setTableRow] = React.useState<IItemMeta | null>(null);

  // Table cells loading coords.
  const [cellsLoading, setCellsLoading] = React.useState<CellLoading | null>(
    null,
  );
  // Fetches the item warehouse locations.
  const {
    data: item,
    isLoading: isItemLoading,
    isSuccess: isItemSuccess,
  } = useItem(tableRow?.itemId, {
    enabled: !!(tableRow && tableRow.itemId),
  });

  // Effects with row cells loading state.
  React.useEffect(() => {
    setCellsLoading(null);

    if (isItemLoading && tableRow) {
      setCellsLoading([
        [tableRow.rowIndex, 'quantity'],
        [tableRow.rowIndex, 'source_warehouse'],
        [tableRow.rowIndex, 'destination_warehouse'],
      ]);
    }
  }, [isItemLoading, tableRow]);

  // New table row meta.
  const newRowMeta = React.useMemo(() => {
    return isItemSuccess
      ? {
          ...tableRow,
          warehouses: transformWarehousesQuantity(item),
        }
      : null;
  }, [isItemSuccess, item, tableRow]);

  // Reset the table row.
  const resetTableRow = React.useCallback(() => {
    setTableRow(null);
    setCellsLoading(null);
  }, []);

  return {
    setTableRow,
    resetTableRow,

    cellsLoading,
    newRowMeta,
  };
};

const transformWarehousesQuantity = (item) => {
  return item.item_warehouses.map((warehouse) => ({
    warehouseId: warehouse.warehouse_id,
    quantityOnHand: warehouse.quantity_on_hand,
    quantityOnHandFormatted: warehouse.quantity_on_hand_formatted,
  }));
};
