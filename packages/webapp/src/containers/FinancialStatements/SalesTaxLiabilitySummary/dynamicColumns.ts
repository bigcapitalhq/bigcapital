import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import type { SalesTaxLiabilityColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

type AlignValue = (typeof Align)[keyof typeof Align];

interface SalesTaxTableColumn {
  key?: string;
  Header?: string;
  id?: string;
  accessor?: string;
  className?: string;
  width?: number;
  sticky?: AlignValue;
  textOverview?: boolean;
  align?: AlignValue;
  money?: boolean;
  disableSortBy?: boolean;
}

type ColumnMapper = (
  data: any[],
) => (column: Record<string, any>) => SalesTaxTableColumn;

type ColumnMatcher = (
  column: Record<string, any>,
) => FO.Option<SalesTaxTableColumn>;

const isColumnKey =
  (key: SalesTaxLiabilityColumnKey): FF.Predicate<Record<string, any>> =>
  (column) =>
    column.key === key;

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const taxNameAccessor: ColumnMapper = (data: any[]) => (column) => ({
  key: column.key,
  Header: column.label,
  accessor: getTableCellValueAccessor(column.cellIndex),
  sticky: 'left',
  width: 300,
  textOverview: true,
  disableSortBy: true,
});

const taxableAmountAccessor: ColumnMapper = (data: any[]) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    Header: column.label,
    id: column.key,
    accessor: getTableCellValueAccessor(column.cellIndex),
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
    disableSortBy: true,
  };
};

const dynamicColumnMatchers = (data: any[]): ColumnMatcher[] => [
  when(isColumnKey('taxName'), taxNameAccessor(data)),
  when(isColumnKey('taxableAmount'), taxableAmountAccessor(data)),
  when(isColumnKey('taxRate'), taxableAmountAccessor(data)),
  when(isColumnKey('taxPercentage'), taxableAmountAccessor(data)),
  when(isColumnKey('collectedTax'), taxableAmountAccessor(data)),
];

const dynamicColumnMapper =
  (data: any[]) =>
  (column: Record<string, any>): SalesTaxTableColumn =>
    FF.pipe(
      column,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match(() => column, FF.identity),
    );

export const salesTaxLiabilitySummaryDynamicColumns = (
  columns: Record<string, any>[],
  data: any[],
) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};
