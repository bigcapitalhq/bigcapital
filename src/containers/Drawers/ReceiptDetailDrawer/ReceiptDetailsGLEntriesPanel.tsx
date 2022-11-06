// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { Card } from '@/components';
import { useTransactionsByReference } from '@/hooks/query';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

import JournalEntriesTable, {
  AmountDisplayedBaseCurrencyMessage,
} from '../../JournalEntriesTable/JournalEntriesTable';

/**
 * Receipt details GL entries panel.
 * @returns {React.JSX}
 */
export function ReceiptDetailsGLEntriesPanel() {
  // Receipt details drawer context.
  const { receiptId } = useReceiptDetailDrawerContext();

  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: receiptId,
      reference_type: 'SaleReceipt',
    },
    { enabled: !!receiptId },
  );

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
