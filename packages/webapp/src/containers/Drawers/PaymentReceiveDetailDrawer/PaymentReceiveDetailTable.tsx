// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';

import { usePaymentReceiveEntriesColumns } from './utils';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

import { TableStyle } from '@/constants';

/**
 * Payment receive readonly details table.
 */
export default function PaymentReceiveDetailTable() {
  const columns = usePaymentReceiveEntriesColumns();

  const {
    paymentReceive: { entries },
  } = usePaymentReceiveDetailContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constraint}
    />
  );
}
