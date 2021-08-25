import React from 'react';
import clsx from 'classnames';

import { usePaymentMadeEntriesColumns } from './utils';
import { DataTable } from 'components';

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

import PaymentDrawerCls from './PaymentMadeDrawer.module.scss';

export default function PaymentMadeDetailTable() {
  const columns = usePaymentMadeEntriesColumns();

  // Payment made details context.
  const { paymentEntries } = usePaymentMadeDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={paymentEntries}
        className={'table-constrant'}
      />
    </div>
  );
}
