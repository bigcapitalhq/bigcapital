import React from 'react';
import intl from 'react-intl-universal';

export const useReceiptReadonlyEntriesTableColumns = () => React.useMemo(() => [
    {
      Header: intl.get('product_and_service'),
      accessor: 'item.name',
      width: 150,
      className: 'name',
      disableSortBy: true
    },
    {
      Header: intl.get('description'),
      accessor: 'description',
      className: 'description',
      disableSortBy: true
    },
    {
      Header: intl.get('quantity'),
      accessor: 'quantity',
      width: 100,
      className: 'quantity',
      disableSortBy: true
    },
    {
      Header: intl.get('rate'),
      accessor: 'rate',
      width: 100,
      className: 'rate',
      disableSortBy: true
    },
    {
      Header: intl.get('amount'),
      accessor: 'amount',
      width: 100,
      className: 'amount',
      disableSortBy: true
    },
  ], []);
  