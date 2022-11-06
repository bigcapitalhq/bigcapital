// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { Card } from '@/components';
import JournalEntriesTable, {
  AmountDisplayedBaseCurrencyMessage,
} from '../../JournalEntriesTable/JournalEntriesTable';

import { useTransactionsByReference } from '@/hooks/query';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

/**
 * Payment made GL entries table panel.
 * @returns {React.JSX}
 */
export default function PaymentMadeGLEntriesPanel() {
  const { paymentMadeId } = usePaymentMadeDetailContext();

  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: paymentMadeId,
      reference_type: 'BillPayment',
    },
    { enabled: !!paymentMadeId },
  );

  return (
    <PaymentMadeGLEntriesRoot>
      <AmountDisplayedBaseCurrencyMessage />
      <JournalEntriesTable
        loading={isTransactionLoading}
        transactions={transactions}
      />
    </PaymentMadeGLEntriesRoot>
  );
}

const PaymentMadeGLEntriesRoot = styled(Card)``;
