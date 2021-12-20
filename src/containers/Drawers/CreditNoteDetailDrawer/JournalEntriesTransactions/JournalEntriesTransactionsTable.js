import React from 'react';
import { DataTable, Card } from 'components';

import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';
import { useTransactionsByReference } from 'hooks/query';
import { useJournalEntriesTransactionsColumns } from './components';

/**
 * Journal entries table.
 */
export default function JournalEntriesTransactionsTable() {
  const { creditNoteId } = useCreditNoteDetailDrawerContext();

  const columns = useJournalEntriesTransactionsColumns();

  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: creditNoteId,
      reference_type: 'creditNote',
    },
    { enabled: !!creditNoteId },
  );

  return (
    <Card>
      <DataTable
        columns={columns}
        data={transactions}
        loading={isTransactionLoading}
        className={'datatable--journal-entries'}
      />
    </Card>
  );
}
