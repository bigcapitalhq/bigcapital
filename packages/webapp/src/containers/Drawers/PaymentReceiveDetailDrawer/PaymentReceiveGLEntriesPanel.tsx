// @ts-nocheck
import styled from 'styled-components';

import { Card } from '@/components';
import JournalEntriesTable, {
  AmountDisplayedBaseCurrencyMessage,
} from '../../JournalEntriesTable/JournalEntriesTable';

import { useTransactionsByReference } from '@/hooks/query';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

/**
 * Payment receive GL entries table panel.
 * @returns {React.JSX}
 */
export function PaymentReceiveGLEntriesPanel() {
  const { paymentReceiveId } = usePaymentReceiveDetailContext();

  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionsLoading,
  } = useTransactionsByReference(
    {
      reference_id: paymentReceiveId,
      reference_type: 'paymentReceive',
    },
    { enabled: !!paymentReceiveId },
  );

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
