import React from 'react';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';
import { usePaymentMadeEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Payment made read-only details table.
 */
export function PaymentMadeDetailTable() {
  // Payment made details context.
  const { paymentMade } = usePaymentMadeDetailContext();
  const entries = paymentMade?.entries ?? [];

  // Retrieve payment made entries columns.
  const columns = usePaymentMadeEntriesColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constrant}
    />
  );
}
