import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { CLASSES } from '../../../../common/classes';
import { DataTable, Card, FormatDateCell } from '../../../../components';

/**
 * Invoice payment transactions datatable.
 */
export default function InvoicePaymentTransactionsTable() {
  const columns = React.useMemo(
    () => [
      {
        id: 'invoice_date',
        Header: intl.get('date'),
        accessor: 'invoice_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'invoice_date',
        textOverview: true,
      },
      {
        id: 'invoice_no',
        Header: intl.get('invoice_no__'),
        accessor: 'invoice_no',
        width: 240,
        className: 'invoice_no',
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
        clickable: true,
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
