import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import { useInventoryTurnoverByAmountContext } from './InventoryTurnoverByAmountProvider';
import type { InventoryTurnoverByAmountColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const isColumnKey =
  (
    key: InventoryTurnoverByAmountColumnKey,
  ): FF.Predicate<Record<string, any>> =>
  (column) =>
    column.key === key;

const getReportColWidth = (
  data: unknown[],
  accessor: string,
  headerText?: string,
) => {
  return getColumnWidth(
    data,
    accessor,
    { magicSpacing: 10, minWidth: 100 },
    headerText,
  );
};

const commonAccessor =
  (data: unknown[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const accessor = getTableCellValueAccessor(column.cellIndex);

    return {
      key: column.key,
      Header: column.label,
      accessor,
      className: column.key,
      textOverview: true,
      align: Align.Left,
    };
  };

const numericColumnAccessor =
  (data: unknown[], money = true) =>
  (column: Record<string, any>): Record<string, any> => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Right,
      money,
      width,
    };
  };

const itemNameColumnAccessor =
  (data: unknown[]) =>
  (column: Record<string, any>): Record<string, any> => {
    return {
      ...column,
      width: 240,
    };
  };

const dateColumnAccessor =
  (data: unknown[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Left,
      width,
    };
  };

const dynamicColumnMatchers = (data: unknown[]) => [
  when(isColumnKey('item_name'), itemNameColumnAccessor(data)),
  when(isColumnKey('opening_balance'), numericColumnAccessor(data)),
  when(isColumnKey('closing_balance'), numericColumnAccessor(data)),
  when(isColumnKey('cost_of_goods_sold'), numericColumnAccessor(data)),
  when(isColumnKey('average_price'), numericColumnAccessor(data)),
  when(isColumnKey('turnover_ratio'), numericColumnAccessor(data, false)),
  when(
    isColumnKey('average_turnover_days'),
    numericColumnAccessor(data, false),
  ),
  when(isColumnKey('last_sell_date'), dateColumnAccessor(data)),
  when(isColumnKey('qty_on_hand'), numericColumnAccessor(data, false)),
];

const dynamicColumnMapper =
  (data: unknown[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const fallback = commonAccessor(data)(column);

    return FF.pipe(
      fallback,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match(() => fallback, FF.identity),
    );
  };

/**
 * Composes the fetched dynamic columns to the table columns.
 */
export const dynamicColumns = (
  columns: Record<string, any>[],
  data: unknown[],
) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};

/**
 * Retrieves the inventory turnover by amount table columns.
 */
export const useInventoryTurnoverByAmountColumns = () => {
  const { inventoryTurnoverByAmount } = useInventoryTurnoverByAmountContext();

  if (!inventoryTurnoverByAmount) {
    throw new Error('The inventory turnover by amount report is not loaded');
  }
  const table = (inventoryTurnoverByAmount as any).table;

  return dynamicColumns(table.columns, table.rows);
};
