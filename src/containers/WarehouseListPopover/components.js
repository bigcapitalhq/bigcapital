import React from 'react';

import { RadioFieldCell } from 'components/DataTableCells';

/**
 * Retrieve  warehouse entries columns.
 */
export function useWarehouseEntriesColumns() {
  return React.useMemo(
    () => [
      {
        Header: 'Warehouse Name',
        accessor: 'warehouse_name',
        Cell: RadioFieldCell,
        width: 120,
        disableSortBy: true,
        className: 'name',
      },
      {
        id: 'quantity',
        Header: 'Quantity on Hand',
        accessor: 'quantity',
        disableSortBy: true,
        align: 'right',
        width: '100',
      },
      {
        id: 'availiable_for_sale',
        Header: 'Availiable for Sale',
        accessor: 'availiable_for_sale',
        disableSortBy: true,
        align: 'right',
        width: '100',
      },
    ],
    [],
  );
}
