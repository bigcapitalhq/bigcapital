import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { DataTable, Money } from 'components';

export default function DrawerTemplateTable({ tableData, currencyCode }) {
  const columns = useMemo(
    () => [
      {
        Header: intl.get('description'),
        accessor: 'description',
        disableSortBy: true,
        width: 150,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        accessor: ({ rate }) => <Money amount={rate} currency={currencyCode} />,
        disableSortBy: true,
        width: 80,
      },
      {
        Header: intl.get('qty'),
        accessor: 'quantity',
        disableSortBy: true,
        width: 80,
      },
      {
        Header: intl.get('total'),
        accessor: ({ total }) => (
          <Money amount={total} currency={currencyCode} />
        ),
        disableSortBy: true,
        width: 70,
      },
    ],
    [],
  );
  return (
    <div className="template__table">
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
