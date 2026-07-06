import * as R from 'ramda';
import { getColumnWidth } from '@/utils';
import { Align } from '@/constants';

interface AgingSummaryColumn {
  key: string;
  label: string;
  cellIndex?: number;
}

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const contactNameAccessor = R.curry(
  (data: unknown[], column: AgingSummaryColumn) => ({
    key: column.key,
    Header: column.label,
    accessor: getTableCellValueAccessor(column.cellIndex!),
    sticky: 'left',
    width: 240,
    textOverview: true,
  }),
);

const currentAccessor = R.curry(
  (data: unknown[], column: AgingSummaryColumn) => {
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
  },
);

const totalAccessor = R.curry((data: unknown[], column: AgingSummaryColumn) => {
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
});

const agingPeriodAccessor = R.curry(
  (data: unknown[], column: AgingSummaryColumn) => {
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
  },
);

/** Matches the column key against both server (snake_case) and legacy
 * (camelCase) spellings. */
const keyIn = (keys: string[]) => (column: AgingSummaryColumn) =>
  keys.includes(column.key);

/**
 * Fallback for unmapped dynamic columns: react-table requires an id or a
 * string accessor - without one the whole report crashes to the error
 * boundary. Renders the cell by index like the aging-period columns.
 */
const unmappedColumnFallback = R.curry(
  (data: unknown[], column: AgingSummaryColumn | Record<string, unknown>) => {
    if ((column as any).accessor || (column as any).id) return column;

    return agingPeriodAccessor(data, column as AgingSummaryColumn);
  },
);

const dynamicColumnMapper = R.curry(
  (data: unknown[], column: AgingSummaryColumn) => {
    const totalAccessorColumn = totalAccessor(data);
    const currentAccessorColumn = currentAccessor(data);
    const customerNameAccessorColumn = contactNameAccessor(data);
    const agingPeriodAccessorColumn = agingPeriodAccessor(data);

    return R.compose(
      unmappedColumnFallback(data),
      R.when(keyIn(['total']), totalAccessorColumn),
      R.when(keyIn(['current']), currentAccessorColumn),
      R.when(
        keyIn(['customer_name', 'customerName', 'vendor_name', 'vendorName']),
        customerNameAccessorColumn,
      ),
      R.when(keyIn(['aging_period', 'agingPeriod']), agingPeriodAccessorColumn),
    )(column);
  },
);

export const agingSummaryDynamicColumns = (
  columns: AgingSummaryColumn[],
  data: unknown[],
) => {
  return R.map(dynamicColumnMapper(data), columns);
};
