import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { CLASSES } from '../../../../common/classes';
import { DataTable, Card, FormatDateCell } from '../../../../components';

/**
 * Receipt payment transactions datatable.
 */
export default function ReceiptPaymentTransactions() {
  const columns = React.useMemo(
    () => [
      {
        id: 'receipt_date',
        Header: intl.get('date'),
        accessor: 'receipt_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'receipt_date',
        textOverview: true,
      },
      {
        id: 'receipt_number',
        Header: intl.get('receipt_no'),
        accessor: 'receipt_number',
        width: 140,
        className: 'receipt_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
        textOverview: true,
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        width: 140,
        className: 'reference_no',
        textOverview: true,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        // accessor: StatusAccessor,
        width: 140,
        className: 'status',
      },
      {
        id: 'qunatity',
        Header: 'Quantity Sold',
      },
      {
        id: 'rate',
        Header: 'Rate',
      },
      {
        id: 'total',
        Header: intl.get('total'),
      },
    ],
    [],
  );

  return (
    <div className="payment-transactions">
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
