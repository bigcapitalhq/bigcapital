import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import type { AgingSummaryColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

interface AgingSummaryColumn {
  key: string;
  label: string;
  cellIndex?: number;
}

interface AgingSummaryTableColumn {
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
}

type AlignValue = (typeof Align)[keyof typeof Align];

type ColumnMapper = (
  data: unknown[],
) => (column: AgingSummaryColumn) => AgingSummaryTableColumn;

type ColumnMatcher = (
  column: AgingSummaryColumn,
) => FO.Option<AgingSummaryTableColumn>;

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const isColumnKey =
  (key: AgingSummaryColumnKey): FF.Predicate<AgingSummaryColumn> =>
  (column) =>
    column.key === key;

const contactNameAccessor: ColumnMapper = (data) => (column) => ({
  key: column.key,
  Header: column.label,
  accessor: getTableCellValueAccessor(column.cellIndex!),
  sticky: 'left',
  width: 240,
  textOverview: true,
});

const currentAccessor: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex!);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
    money: true,
  };
};

const totalAccessor: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex!);

  return {
    Header: column.label,
    id: column.key,
    accessor: getTableCellValueAccessor(column.cellIndex!),
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
    money: true,
  };
};

const agingPeriodAccessor: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex!);

  return {
    Header: column.label,
    id: `${column.key}-${column.cellIndex}`,
    accessor,
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
    money: true,
  };
};

const dynamicColumnMatchers = (data: unknown[]): ColumnMatcher[] => [
  when(isColumnKey('total'), totalAccessor(data)),
  when(isColumnKey('current'), currentAccessor(data)),
  when(isColumnKey('customer_name'), contactNameAccessor(data)),
  when(isColumnKey('vendor_name'), contactNameAccessor(data)),
  when(isColumnKey('aging_period'), agingPeriodAccessor(data)),
];

const dynamicColumnMapper =
  (data: unknown[]) =>
  (column: AgingSummaryColumn): AgingSummaryTableColumn =>
    FF.pipe(
      column,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match((): AgingSummaryTableColumn => column, FF.identity),
    );

export const agingSummaryDynamicColumns = (
  columns: AgingSummaryColumn[],
  data: unknown[],
) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};
