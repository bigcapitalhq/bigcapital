import React from 'react';
import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';
import { useJournalEntriesTransactionsColumns } from './components';
import { Card } from '@/components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '@/containers/JournalEntriesTable/JournalEntriesTable';
import { useTransactionsByReference } from '@/hooks/query';

/**
 * Journal entries table.
 */
export function CreditNoteGLEntriesTable() {
  const { creditNoteId } = useCreditNoteDetailDrawerContext();

  // Credit note GL entries table columns.
  const columns = useJournalEntriesTransactionsColumns();

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      referenceId: creditNoteId ?? 0,
      referenceType: 'creditNote',
    },
    { enabled: !!creditNoteId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <Card>
      <AmountDisplayedBaseCurrencyMessage />

      <JournalEntriesTable
        columns={columns}
        transactions={transactions}
        loading={isTransactionLoading}
      />
    </Card>
  );
}
