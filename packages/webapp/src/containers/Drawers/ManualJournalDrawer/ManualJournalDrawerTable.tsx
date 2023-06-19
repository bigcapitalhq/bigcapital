// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';
import { useManualJournalEntriesColumns } from './utils';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';

import { TableStyle } from '@/constants';

/**
 * Manual journal drawer table.
 */
export default function ManualJournalDrawerTable() {
  // Retrieves the readonly manual journal entries columns.
  const columns = useManualJournalEntriesColumns();

  // Manual journal drawer context.
  const { manualJournal } = useManualJournalDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={manualJournal.entries}
      styleName={TableStyle.Constraint}
    />
  );
}
