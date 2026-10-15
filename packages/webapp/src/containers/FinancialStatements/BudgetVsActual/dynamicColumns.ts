import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

type AlignValue = (typeof Align)[keyof typeof Align];

interface BudgetVsActualTableColumn {
  key?: string;
  Header?: string;
  id?: string;
  accessor?: string;
  className?: string;
  width?: number;
  sticky?: AlignValue;
  textOverview?: boolean;
  align?: AlignValue;
  disableSortBy?: boolean;
}

type ColumnMapper = (
  data: any[],
) => (column: Record<string, any>) => BudgetVsActualTableColumn;

type ColumnMatcher = (
  column: Record<string, any>,
) => FO.Option<BudgetVsActualTableColumn>;

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const isAccountColumn = (column: Record<string, any>) =>
  column.key === 'account';

/**
 * The period columns carry a dynamic suffix (e.g. `budget_2025-01`), so the
 * money columns are matched by prefix/known total keys instead of exact keys.
 */
const isMoneyColumn = (column: Record<string, any>) => {
  const key = column.key as string | undefined;
  return (
    !!key &&
    (key.startsWith('budget_') ||
      key.startsWith('actual_') ||
      [
        'total_budget',
        'total_actual',
        'variance',
        'variance_percentage',
      ].includes(key))
  );
};

const accountAccessor: ColumnMapper = (_data) => (column) => ({
  key: column.key,
  Header: column.label,
  accessor: getTableCellValueAccessor(column.cellIndex),
  sticky: 'left',
  width: 300,
  textOverview: true,
  disableSortBy: true,
});

const moneyAccessor: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    key: column.key,
    id: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
    disableSortBy: true,
  };
};

const dynamicColumnMatchers = (data: any[]): ColumnMatcher[] => [
  when(isAccountColumn, accountAccessor(data)),
  when(isMoneyColumn, moneyAccessor(data)),
];

const dynamicColumnMapper =
  (data: any[]) =>
  (column: Record<string, any>): BudgetVsActualTableColumn =>
    FF.pipe(
      column,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match(() => column, FF.identity),
    );

export const budgetVsActualDynamicColumns = (
  columns: Record<string, any>[] = [],
  data: any[] = [],
) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};
