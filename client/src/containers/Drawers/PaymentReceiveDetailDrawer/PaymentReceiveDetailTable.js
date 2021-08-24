import React from 'react';
import { usePaymentReceiveEntriesColumns } from './utils';
import { DataTable, Card } from 'components';

import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

export default function PaymentReceiveDetailTable() {
  const columns = usePaymentReceiveEntriesColumns();
  const {
    paymentReceive: { entries },
  } = usePaymentReceiveDetailContext();

  return (
    <div className="payment-drawer__content--table">
      <DataTable columns={columns} data={entries} />
    </div>
  );
}
