import React from 'react';
import { usePaymentMadeEntriesColumns } from './utils';
import { DataTable } from 'components';

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

export default function PaymentMadeDetailTable() {
  const columns = usePaymentMadeEntriesColumns();

  const { paymentEntries } = usePaymentMadeDetailContext();

  return (
    <div className="payment-drawer__content--table">
      <DataTable columns={columns} data={paymentEntries} />
    </div>
  );
}
