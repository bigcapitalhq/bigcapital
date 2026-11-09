import React from 'react';
import styled from 'styled-components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '../../JournalEntriesTable/JournalEntriesTable';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import { Card } from '@/components';
import { useTransactionsByReference } from '@/hooks/query';

/**
 * Receipt details GL entries panel.
 */
export function ReceiptDetailsGLEntriesPanel() {
  // Receipt details drawer context.
  const { receiptId } = useReceiptDetailDrawerContext();

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      referenceId: receiptId as number,
      referenceType: 'SaleReceipt',
    },
    { enabled: !!receiptId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <ReceiptGLEntriesRoot>
      <AmountDisplayedBaseCurrencyMessage />
      <JournalEntriesTable
        loading={isTransactionLoading}
        transactions={transactions}
      />
    </ReceiptGLEntriesRoot>
  );
}

const ReceiptGLEntriesRoot = styled(Card)``;
