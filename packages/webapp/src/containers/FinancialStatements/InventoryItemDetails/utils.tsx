import * as R from 'ramda';

import { getColumnWidth } from '@/utils';
import { Align } from '@/constants';
import { flow } from 'fp-ts/function';

const itemNameOrDateColumn = R.curry(
  (data: unknown[], index: number, column: Record<string, any>) => ({
    id: column.key,
    key: column.key,
    Header: column.label,
    accessor: `cells[${index}].value`,
    className: column.key,
    width: getColumnWidth(data, `cells.${index}.key`, {
      minWidth: 130,
      magicSpacing: 10,
    }),
    disableSortBy: true,
  }),
);

const numericColumn = R.curry(
  (data: unknown[], index: number, column: Record<string, any>) => ({
    id: column.key,
    key: column.key,
    Header: column.label,
    accessor: `cells[${index}].value`,
    className: column.key,
    width: getColumnWidth(data, `cells.${index}.key`, {
      minWidth: 130,
      magicSpacing: 10,
    }),
    disableSortBy: true,
    align: Align.Right,
    money: true,
  }),
);

const columnsMapper = R.curry(
  (data: unknown[], index: number, column: Record<string, any>) => ({
    id: column.key,
    key: column.key,
    Header: column.label,
    accessor: `cells[${index}].value`,
    className: column.key,
    width: getColumnWidth(data, `cells.${index}.key`, {
      minWidth: 130,
      magicSpacing: 10,
    }),
    disableSortBy: true,
    textOverview: true,
  }),
);

/**
 * Inventory item details columns.
 */
export const dynamicColumns = (
  columns: Record<string, any>[],
  data: unknown[],
) => {
  const mapper = (column: Record<string, any>, index: number) => {
    return flow(
      R.cond([
        [R.pathEq(['key'], 'date'), itemNameOrDateColumn(data, index)],
        [R.pathEq(['key'], 'runningQuantity'), numericColumn(data, index)],
        [R.pathEq(['key'], 'profitMargin'), numericColumn(data, index)],
        [R.pathEq(['key'], 'runningValue'), numericColumn(data, index)],
        [R.pathEq(['key'], 'quantity'), numericColumn(data, index)],
        [R.pathEq(['key'], 'rate'), numericColumn(data, index)],
        [R.pathEq(['key'], 'total'), numericColumn(data, index)],
        [R.pathEq(['key'], 'value'), numericColumn(data, index)],
        [R.T, columnsMapper(data, index)],
      ]),
    )(column);
  };
  return columns.map(mapper);
};
