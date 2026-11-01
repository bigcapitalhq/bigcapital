import React from 'react';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';
import { usePaymentReceiveEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Payment receive readonly details table.
 */
export function PaymentReceiveDetailTable() {
  const { paymentReceive } = usePaymentReceiveDetailContext();
  const entries = paymentReceive?.entries ?? [];

  const columns = usePaymentReceiveEntriesColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constrant}
    />
  );
}
