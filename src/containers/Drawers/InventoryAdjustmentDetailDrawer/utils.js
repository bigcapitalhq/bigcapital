import React from 'react';
import intl from 'react-intl-universal';

export const useInventoryAdjustmentEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('inventory_adjustment.column.product'),
        accessor: 'item.name',
        width: 150,
        className: 'name',
        disableSortBy: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
      {
        Header: intl.get('cost'),
        accessor: 'cost',
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
      {
        Header: intl.get('value'),
        accessor: 'value',
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
    ],
    [],
  );
