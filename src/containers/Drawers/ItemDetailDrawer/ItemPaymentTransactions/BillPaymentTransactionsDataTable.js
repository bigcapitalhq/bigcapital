import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { CLASSES } from '../../../../common/classes';
import { DataTable, Card, FormatDateCell } from '../../../../components';

/**
 * Bill payment transactions data table.
 */
export default function BillPaymentTransactions() {
  const columns = React.useMemo(
    () => [
      {
        id: 'bill_date',
        Header: intl.get('date'),
        accessor: 'bill_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'bill_date',
      },
      {
        id: 'bill_number',
        Header: intl.get('bill_number'),
        accessor: (row) => (row.bill_number ? `${row.bill_number}` : null),
        width: 100,
        className: 'bill_number',
      },
      {
        id: 'vendor',
        Header: intl.get('vendor_name'),
        accessor: 'vendor.display_name',
        width: 180,
        className: 'vendor',
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        width: 90,
        className: 'reference_no',
      },
      {
        id: 'qunatity',
        Header: 'Quantity Purchase',
      },
      {
        id: 'rate',
        Header: 'Rate',
      },
      {
        id: 'total',
        Header: intl.get('total'),
      },
      {
        id: 'status',
        Header: intl.get('status'),
        // accessor: (row) => statusAccessor(row),
        width: 160,
        className: 'status',
      },
    ],
    [],
  );

  return (
    <div className="item-drawer__table">
      <Card>
        <DataTable
          columns={columns}
          data={[]}
          // loading={}
          // headerLoading={}
          // progressBarLoading={}
        />
      </Card>
    </div>
  );
}
