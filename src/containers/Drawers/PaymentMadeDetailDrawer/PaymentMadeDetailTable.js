import React from 'react';
import clsx from 'classnames';

import { usePaymentMadeEntriesColumns } from './utils';
import { DataTable } from 'components';

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

import PaymentDrawerCls from './PaymentMadeDrawer.module.scss';

/**
 * Payment made read-only details table.
 */
export default function PaymentMadeDetailTable() {
  // Retrieve payment made entries columns.
  const columns = usePaymentMadeEntriesColumns();

  // Payment made details context.
  const { paymentMade } = usePaymentMadeDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={paymentMade.entries}
        className={'table-constrant'}
      />
    </div>
  );
}
