import React from 'react';
import clsx from 'classnames';

import { usePaymentReceiveEntriesColumns } from './utils';
import { DataTable } from 'components';

import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

import PaymentDrawerCls from './PaymentReceiveDrawer.module.scss';

/**
 * Payment receive readonly details table.
 */
export default function PaymentReceiveDetailTable() {
  const columns = usePaymentReceiveEntriesColumns();

  const {
    paymentReceive: { entries },
  } = usePaymentReceiveDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={entries}
        className={'table-constrant'}
      />
    </div>
  );
}
