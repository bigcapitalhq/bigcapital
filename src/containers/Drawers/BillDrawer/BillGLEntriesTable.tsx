// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { Card } from '@/components';

import { useTransactionsByReference } from '@/hooks/query';
import { useBillDrawerContext } from './BillDrawerProvider';

import JournalEntriesTable, {
  AmountDisplayedBaseCurrencyMessage,
} from '../../JournalEntriesTable/JournalEntriesTable';

/**
 * Bill GL entries table.
 * @returns {React.JSX}
 */
export default function BillGLEntriesTable() {
  const { billId } = useBillDrawerContext();

  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: billId,
      reference_type: 'Bill',
    },
    { enabled: !!billId },
  );

  return (
    <BilleGLEntriesRoot>
      <AmountDisplayedBaseCurrencyMessage />
      <BillGLEntriesDatatable
        loading={isTransactionLoading}
        transactions={transactions}
      />
    </BilleGLEntriesRoot>
  );
}

const BilleGLEntriesRoot = styled(Card)``;

const BillGLEntriesDatatable = styled(JournalEntriesTable)`
  .table .tbody .tr:last-child .td {
    border-bottom: 0;
  }
`;
