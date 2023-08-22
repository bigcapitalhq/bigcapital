// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { Card } from '@/components';
import { useTransactionsByReference } from '@/hooks/query';
import { useInventoryAdjustmentDrawerContext } from './InventoryAdjustmentDrawerProvider';

import JournalEntriesTable, {
  AmountDisplayedBaseCurrencyMessage,
} from '../../JournalEntriesTable/JournalEntriesTable';

/**
 * Inentory adjustment detail GL entries panel.
 * @returns {React.JSX}
 */
export default function InventoryAdjustmentDetailGLEntriesPanel() {
  const { inventoryId } = useInventoryAdjustmentDrawerContext();

  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: inventoryId,
      reference_type: 'inventoryAdjustment',
    },
    { enabled: !!inventoryId },
  );

  return (
    <InventoryAdjustmentGLEntriesRoot>
      <AmountDisplayedBaseCurrencyMessage />
      <JournalEntriesTable
        loading={isTransactionLoading}
        transactions={transactions}
      />
    </InventoryAdjustmentGLEntriesRoot>
  );
}

const InventoryAdjustmentGLEntriesRoot = styled(Card)``;
