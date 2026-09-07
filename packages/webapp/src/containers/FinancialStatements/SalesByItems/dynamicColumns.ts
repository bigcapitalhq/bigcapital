import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import { useSalesByItemsContext } from './SalesByItemProvider';
import type { SalesByItemsColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const isColumnKey =
  (key: SalesByItemsColumnKey): FF.Predicate<Record<string, any>> =>
  (column) =>
    column.key === key;

const getReportColWidth = (
  data: any[],
  accessor: string,
  headerText: string,
) => {
  return getColumnWidth(
    data,
    accessor,
    { magicSpacing: 10, minWidth: 100 },
    headerText,
  );
};

/**
 * Account name column mapper.
 */
const commonColumnMapper =
  (data: any[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const accessor = getTableCellValueAccessor(column.cellIndex);

    return {
      key: column.key,
      Header: column.label,
      accessor,
      className: column.key,
      textOverview: true,
    };
  };

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor =
  (data: any[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Right,
      width,
      money: true,
    };
  };

/**
 * Item name column accessor.
 */
const itemNameColumnAccessor =
  (data: any[]) =>
  (column: Record<string, any>): Record<string, any> => {
    return {
      ...column,
      width: 180,
    };
  };

const dynamicColumnMatchers = (data: any[]) => [
  when(isColumnKey('item_name'), itemNameColumnAccessor(data)),
  when(isColumnKey('sold_quantity'), numericColumnAccessor(data)),
  when(isColumnKey('sold_amount'), numericColumnAccessor(data)),
  when(isColumnKey('average_price'), numericColumnAccessor(data)),
];

const dynamicColumnMapper =
  (data: any[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const fallback = commonColumnMapper(data)(column);

    return FF.pipe(
      fallback,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match(() => fallback, FF.identity),
    );
  };

/**
 * Composes the dynamic columns that fetched from request to columns to table component.
 */
export const dynamicColumns = (data: any[], columns: Record<string, any>[]) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};

/**
 * Retrieves the sales by items sheet table columns for table component.
 */
export const useSalesByItemsTableColumns = () => {
  const { salesByItems } = useSalesByItemsContext();

  if (!salesByItems) {
    throw new Error('Sales by items context not found');
  }
  const table = (salesByItems as any).table;

  return dynamicColumns(table.rows, table.columns);
};
