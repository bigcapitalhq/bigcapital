import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import type { TrialBalanceColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

type AlignValue = (typeof Align)[keyof typeof Align];

interface TrialBalanceTableColumn {
  Header?: string;
  id?: string;
  accessor?: string;
  className?: string;
  width?: number;
  align?: AlignValue;
  money?: boolean;
}

type ColumnMapper = (data: any) => (column: any) => TrialBalanceTableColumn;

type ColumnMatcher = (column: any) => FO.Option<TrialBalanceTableColumn>;

const isColumnKey =
  (key: TrialBalanceColumnKey): FF.Predicate<any> =>
  (column) =>
    column.key === key;

const ACCOUNT_NAME_COLUMN_WIDTH = 320;
const AMOUNT_COLUMNS_MIN_WIDTH = 120;
const AMOUNT_COLUMNS_MAGIC_SPACING = 10;

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const accountNameAccessor: ColumnMapper = (data: any) => (column: any) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    Header: column.label,
    id: column.key,
    accessor,
    className: column.key,
    width: ACCOUNT_NAME_COLUMN_WIDTH,
  };
};

const amountAccessor: ColumnMapper = (data: any) => (column: any) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    Header: column.label,
    id: column.key,
    accessor,
    className: column.key,
    width: getColumnWidth(data, accessor, {
      magicSpacing: AMOUNT_COLUMNS_MAGIC_SPACING,
      minWidth: AMOUNT_COLUMNS_MIN_WIDTH,
    }),
    align: Align.Right,
    money: true,
  };
};

const dynamicColumnMatchers = (data: any): ColumnMatcher[] => [
  when(isColumnKey('account'), accountNameAccessor(data)),
  when(isColumnKey('credit'), amountAccessor(data)),
  when(isColumnKey('debit'), amountAccessor(data)),
  when(isColumnKey('total'), amountAccessor(data)),
];

const dynamicColumnMapper =
  (data: any) =>
  (column: any): TrialBalanceTableColumn =>
    FF.pipe(
      column,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match(() => column, FF.identity),
    );

export const trialBalancesheetDynamicColumns = (
  columns: any[],
  data: any[],
) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};
