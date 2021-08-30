import React from 'react';
import intl from 'react-intl-universal';

export const useInventoryAdjustmentEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        width: 150,
        className: 'name',
        disableSortBy: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        width: 100,
        className: 'quantity',
        disableSortBy: true,
      },
      {
        Header: intl.get('cost'),
        accessor: 'cost',
        width: 100,
        className: 'cost',
        disableSortBy: true,
      },
      {
        Header: intl.get('value'),
        accessor: 'value',
        width: 100,
        className: 'value',
        disableSortBy: true,
      },
    ],
    [],
  );
