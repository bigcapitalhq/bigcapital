import React from 'react';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';
import { useManualJournalEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Manual journal drawer table.
 */
export function ManualJournalDrawerTable() {
  // Retrieves the readonly manual journal entries columns.
  const columns = useManualJournalEntriesColumns();

  // Manual journal drawer context.
  const { manualJournal } = useManualJournalDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={manualJournal?.entries ?? []}
      styleName={TableStyle.Constrant}
    />
  );
}
