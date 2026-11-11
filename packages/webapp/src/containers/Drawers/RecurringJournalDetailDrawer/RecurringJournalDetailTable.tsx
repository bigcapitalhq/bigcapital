import React from 'react';
import { useRecurringJournalDetailDrawerContext } from './RecurringJournalDetailDrawerProvider';
import { useRecurringJournalReadonlyEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Recurring journal readonly details entries table.
 */
export function RecurringJournalDetailTable() {
  const columns = useRecurringJournalReadonlyEntriesColumns();
  const { recurringJournal } = useRecurringJournalDetailDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={recurringJournal?.entries ?? []}
      styleName={TableStyle.Constrant}
    />
  );
}
