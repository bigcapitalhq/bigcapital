import React from 'react';
import styled from 'styled-components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '../../JournalEntriesTable/JournalEntriesTable';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';
import { Card } from '@/components';
import { useTransactionsByReference } from '@/hooks/query';

/**
 * Payment receive GL entries table panel.
 */
export function PaymentReceiveGLEntriesPanel() {
  const { paymentReceiveId } = usePaymentReceiveDetailContext();

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionsLoading } = useTransactionsByReference(
    {
      referenceId: paymentReceiveId as number,
      referenceType: 'PaymentReceive',
    },
    { enabled: !!paymentReceiveId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <PaymentReceiveGLEntriesRoot>
      <AmountDisplayedBaseCurrencyMessage />
      <JournalEntriesTable
        loading={isTransactionsLoading}
        transactions={transactions}
      />
    </PaymentReceiveGLEntriesRoot>
  );
}

const PaymentReceiveGLEntriesRoot = styled(Card)``;
