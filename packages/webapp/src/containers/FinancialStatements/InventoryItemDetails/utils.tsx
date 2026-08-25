import * as R from 'ramda';
import type { InventoryItemDetailsColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

const isColumnKey = (key: InventoryItemDetailsColumnKey) =>
  R.pathEq(['key'], key);

const itemNameOrDateColumn = R.curry(
  (data: unknown[], index: number, column: Record<string, any>) => ({
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
  }),
);

const numericColumn = R.curry(
  (data: unknown[], index: number, column: Record<string, any>) => ({
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
  }),
);

const columnsMapper = R.curry(
  (data: unknown[], index: number, column: Record<string, any>) => ({
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
  }),
);

/**
 * Inventory item details columns.
 */
export const dynamicColumns = (
  columns: Record<string, any>[],
  data: unknown[],
) => {
  const mapper = (column: Record<string, any>, index: number) => {
    return R.compose(
      R.cond([
        [isColumnKey('date'), itemNameOrDateColumn(data, index)],
        [isColumnKey('running_quantity'), numericColumn(data, index)],
        [isColumnKey('profit_margin'), numericColumn(data, index)],
        [isColumnKey('running_value'), numericColumn(data, index)],
        [isColumnKey('quantity'), numericColumn(data, index)],
        [isColumnKey('rate'), numericColumn(data, index)],
        [isColumnKey('total'), numericColumn(data, index)],
        [isColumnKey('value'), numericColumn(data, index)],
        [R.T, columnsMapper(data, index)],
      ]),
    )(column);
  };
  return columns.map(mapper);
};
