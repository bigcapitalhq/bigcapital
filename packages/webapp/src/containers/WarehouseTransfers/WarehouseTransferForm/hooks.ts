import React from 'react';
import type { WarehouseTransferEntryWarehouse } from './types';
import { useItem } from '@/hooks/query';

interface IItemMeta {
  rowIndex: number;
  columnId: string;
  itemId: number;

  sourceWarehouseId: number | string;
  destinationWarehouseId: number | string;
}

type CellLoadingCoord = [number, string];
type CellLoading = CellLoadingCoord[] | null;

interface IRowExtra {
  warehouses: WarehouseTransferEntryWarehouse[];
}

interface ItemWarehouseRaw {
  warehouseId: number;
  quantityOnHand: number;
  quantityOnHandFormatted: string;
}

interface ItemWithWarehouses {
  itemWarehouses?: ItemWarehouseRaw[];
}

/**
 * Fetches the item warehouse quantity.
 * @returns
 */
export const useFetchItemWarehouseQuantity = () => {
  // Holds the table row meta of the given row index.
  const [tableRow, setTableRow] = React.useState<IItemMeta | null>(null);

  // Table cells loading coords.
  const [cellsLoading, setCellsLoading] = React.useState<CellLoading>(null);
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
        [tableRow.rowIndex, 'sourceWarehouse'],
        [tableRow.rowIndex, 'destinationWarehouse'],
      ]);
    }
  }, [isItemLoading, tableRow]);

  // New table row meta.
  const newRowMeta = React.useMemo<(IItemMeta & IRowExtra) | null>(() => {
    return isItemSuccess && tableRow
      ? {
          ...tableRow,
          warehouses: transformWarehousesQuantity(item as ItemWithWarehouses),
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

const transformWarehousesQuantity = (
  item: ItemWithWarehouses,
): WarehouseTransferEntryWarehouse[] => {
  return (item.itemWarehouses ?? []).map((warehouse) => ({
    warehouseId: warehouse.warehouseId,
    quantityOnHand: warehouse.quantityOnHand,
    quantityOnHandFormatted: warehouse.quantityOnHandFormatted,
  }));
};
