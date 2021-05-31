import React from 'react';
import * as R from 'ramda';
import { getColumnWidth, getForceWidth } from 'utils';

/**
 *  columns mapper.
 */
const columnsMapper = (data, index, column) => ({
  id: column.key,
  key: column.key,
  Header: column.label,
  accessor: ({ cells }) => {
    return (
      <span
        className={'force-width'}
        style={{
          minWidth: getForceWidth(cells[0].value),
        }}
      >
        {cells[index]?.value}
      </span>
    );
  },
  className: column.key,
  width: getColumnWidth(data, `cells.${index}.key`, {
    minWidth: 130,
    magicSpacing: 10,
  }),
  disableSortBy: true,
});

/**
 * Inventory item details columns.
 */
export const dynamicColumns = (columns, data) => {
  const mapper = (column, index) => {
    return R.compose(
      R.when(R.pathEq(['key']), R.curry(columnsMapper)(data, index)),
    )(column);
  };
  return columns.map(mapper);
};
