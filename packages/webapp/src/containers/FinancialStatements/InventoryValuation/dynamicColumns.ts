import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import { useInventoryValuationContext } from './InventoryValuationProvider';
import type { InventoryValuationColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const isColumnKey =
  (key: InventoryValuationColumnKey): FF.Predicate<Record<string, any>> =>
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

/**
 * Common column mapper.
 */
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

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor =
  (data: unknown[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Right,
      money: true,
      width,
    };
  };

/**
 * Item name column accessor.
 */
const itemNameColumnAccessor =
  (data: unknown[]) =>
  (column: Record<string, any>): Record<string, any> => {
    return {
      ...column,
      width: 240,
    };
  };

const dynamicColumnMatchers = (data: unknown[]) => [
  when(isColumnKey('item_name'), itemNameColumnAccessor(data)),
  when(isColumnKey('quantity'), numericColumnAccessor(data)),
  when(isColumnKey('valuation'), numericColumnAccessor(data)),
  when(isColumnKey('average'), numericColumnAccessor(data)),
];

/**
 * Dynamic column mapper.
 */
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
 * Composes the fetched dynamic columns from the server to the columns to pass it
 * to the table component.
 */
export const dynamicColumns = (
  columns: Record<string, any>[],
  data: unknown[],
) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};

/**
 * Retrieves the table columns of inventory valuation sheet.
 */
export const useInventoryValuationColumns = () => {
  const { inventoryValuation } = useInventoryValuationContext();

  if (!inventoryValuation) {
    throw new Error('The inventory valuation is not loaded');
  }
  const table = (inventoryValuation as any).table;

  return dynamicColumns(table.columns, table.rows);
};
