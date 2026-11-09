import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import intl from 'react-intl-universal';
import type { CashFlowColumnKey } from '@bigcapital/sdk-ts';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

interface ReportTableColumn {
  key: string;
  label: string;
  cellIndex?: number;
  children?: ReportTableColumn[];
}

interface TableColumn {
  id?: string;
  key?: string;
  Header?: string;
  accessor?: string;
  className?: string;
  width?: number;
  sticky?: AlignValue;
  align?: AlignValue;
  disableSortBy?: boolean;
  textOverview?: boolean;
  money?: boolean;
  Cell?: typeof CellTextSpan;
}

type AlignValue = (typeof Align)[keyof typeof Align];

type ColumnMatcher = (column: ReportTableColumn) => FO.Option<TableColumn>;

const isColumnKey =
  (key: CashFlowColumnKey): FF.Predicate<ReportTableColumn> =>
  (column) =>
    column.key === key;

const accountNameMapper = (column: ReportTableColumn): TableColumn => ({
  id: column.key,
  key: column.key,
  Header: intl.get('account_name'),
  accessor: 'cells[0].value',
  className: 'account_name',
  textOverview: true,
  width: 400,
  disableSortBy: true,
  sticky: Align.Left,
});

const dateRangeMapper =
  (data: unknown[], index: number) =>
  (column: ReportTableColumn): TableColumn => ({
    id: column.key,
    Header: column.label,
    key: column.key,
    accessor: `cells[${index}].value`,
    width: getColumnWidth(data, `cells.${index}.value`, {
      magicSpacing: 12,
      minWidth: 100,
    }),
    className: `date-period ${column.key}`,
    disableSortBy: true,
    textOverview: true,
    align: Align.Right,
    money: true,
  });

const totalMapper =
  (data: unknown[], index: number) =>
  (column: ReportTableColumn): TableColumn => ({
    key: 'total',
    Header: intl.get('total'),
    accessor: `cells[${index}].value`,
    className: 'total',
    textOverview: true,
    Cell: CellTextSpan,
    width: getColumnWidth(data, `cells[${index}].value`, {
      magicSpacing: 12,
      minWidth: 100,
    }),
    disableSortBy: true,
    align: Align.Right,
    money: true,
  });

const isMatchesDateRange = (r: string) => /^date-range/.test(r);

const isDateRangeColumn: FF.Predicate<ReportTableColumn> = (column) =>
  isMatchesDateRange(column.key);

const dynamicColumnMatchers = (
  data: unknown[],
  index: number,
): ColumnMatcher[] => [
  when(isDateRangeColumn, dateRangeMapper(data, index)),
  when(isColumnKey('name'), accountNameMapper),
  when(isColumnKey('total'), totalMapper(data, index)),
];

export const dynamicColumns = (
  columns: ReportTableColumn[],
  data: unknown[],
): TableColumn[] => {
  const mapper = (column: ReportTableColumn, index: number): TableColumn =>
    FF.pipe(
      column,
      firstMatch(dynamicColumnMatchers(data, index)),
      FO.match((): TableColumn => column, FF.identity),
    );

  return columns.map(mapper);
};
