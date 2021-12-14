import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { CLASSES } from '../../../../common/classes';
import { DataTable, Card, FormatDateCell } from '../../../../components';

/**
 * Esimtate payment transactions datatable.
 */
export default function EstimatePaymentTransactions() {
  const columns = React.useMemo(
    () => [
      {
        id: 'estimate_date',
        Header: intl.get('date'),
        accessor: 'estimate_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'estimate_date',
        textOverview: true,
      },
      {
        id: 'estimate_number',
        Header: intl.get('estimate_no'),
        accessor: 'estimate_number',
        width: 100,
        className: 'estimate_number',
        textOverview: true,
      },
      {
        id: 'reference',
        Header: intl.get('reference_no'),
        accessor: 'reference',
        width: 140,
        className: 'reference',
      },
      {
        id: 'customer_id',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
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
