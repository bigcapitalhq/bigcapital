import type { InventoryItemDetailsColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

const itemNameOrDateColumn =
  (data: unknown[], index: number) => (column: Record<string, any>) => ({
    id: column.key,
    key: column.key,
    Header: column.label,
    accessor: `cells[${index}].value`,
    className: column.key,
    width: getColumnWidth(data, `cells.${index}.key`, {
      minWidth: 130,
      magicSpacing: 10,
    }),
    disableSortBy: true,
  });

const numericColumn =
  (data: unknown[], index: number) => (column: Record<string, any>) => ({
    id: column.key,
    key: column.key,
    Header: column.label,
    accessor: `cells[${index}].value`,
    className: column.key,
    width: getColumnWidth(data, `cells.${index}.key`, {
      minWidth: 130,
      magicSpacing: 10,
    }),
    disableSortBy: true,
    align: Align.Right,
    money: true,
  });

const columnsMapper =
  (data: unknown[], index: number) => (column: Record<string, any>) => ({
    id: column.key,
    key: column.key,
    Header: column.label,
    accessor: `cells[${index}].value`,
    className: column.key,
    width: getColumnWidth(data, `cells.${index}.key`, {
      minWidth: 130,
      magicSpacing: 10,
    }),
    disableSortBy: true,
    textOverview: true,
  });

/**
 * Inventory item details columns.
 */
export const dynamicColumns = (
  columns: Record<string, any>[],
  data: unknown[],
) => {
  const mapper = (column: Record<string, any>, index: number) => {
    switch (column.key as InventoryItemDetailsColumnKey) {
      case 'date':
        return itemNameOrDateColumn(data, index)(column);
      case 'running_quantity':
      case 'profit_margin':
      case 'running_value':
      case 'quantity':
      case 'rate':
      case 'total':
      case 'value':
        return numericColumn(data, index)(column);
      default:
        return columnsMapper(data, index)(column);
    }
  };
  return columns.map(mapper);
};
