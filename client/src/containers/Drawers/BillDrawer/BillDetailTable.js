import React from 'react';

import intl from 'react-intl-universal';

import { DataTable, Card } from 'components';

import { useBillDrawerContext } from './BillDrawerProvider';

export default function BillDetailTable() {
  const {
    bill: { entries },
  } = useBillDrawerContext();

  const columns = React.useMemo(() => [
    {
      Header: intl.get('product_and_service'),
      accessor: 'item.name',
      width: 150,
    },
    {
      Header: intl.get('description'),
      accessor: 'description',
    },
    {
      Header: intl.get('quantity'),
      accessor: 'quantity',
      width: 100,
    },
    {
      Header: intl.get('rate'),
      accessor: 'rate',
      width: 100,
    },
    {
      Header: intl.get('amount'),
      accessor: 'amount',
      width: 100,
    },
  ]);

  return (
    <Card>
      <DataTable columns={columns} data={entries} />
    </Card>
  );
}
