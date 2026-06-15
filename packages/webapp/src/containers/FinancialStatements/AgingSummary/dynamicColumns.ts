import * as R from 'ramda';
import { getColumnWidth } from '@/utils';
import { Align } from '@/constants';
import { flow } from 'fp-ts/function';

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

const dynamicColumnMapper = R.curry(
  (data: unknown[], column: AgingSummaryColumn) => {
    const totalAccessorColumn = totalAccessor(data);
    const currentAccessorColumn = currentAccessor(data);
    const customerNameAccessorColumn = contactNameAccessor(data);
    const agingPeriodAccessorColumn = agingPeriodAccessor(data);

    return flow(
      R.when(R.pathEq(['key'], 'agingPeriod'), agingPeriodAccessorColumn),
      R.when(R.pathEq(['key'], 'vendorName'), customerNameAccessorColumn),
      R.when(R.pathEq(['key'], 'customerName'), customerNameAccessorColumn),
      R.when(R.pathEq(['key'], 'current'), currentAccessorColumn),
      R.when(R.pathEq(['key'], 'total'), totalAccessorColumn),
    )(column);
  },
);

export const agingSummaryDynamicColumns = (
  columns: AgingSummaryColumn[],
  data: unknown[],
) => {
  return R.map(dynamicColumnMapper(data), columns);
};
