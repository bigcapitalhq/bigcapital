// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';

import { usePaymentMadeEntriesColumns } from './utils';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

import { TableStyle } from '@/constants';

/**
 * Payment made read-only details table.
 */
export default function PaymentMadeDetailTable() {
  // Retrieve payment made entries columns.
  const columns = usePaymentMadeEntriesColumns();

  // Payment made details context.
  const { paymentMade } = usePaymentMadeDetailContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={paymentMade.entries}
      styleName={TableStyle.Constraint}
    />
  );
}
