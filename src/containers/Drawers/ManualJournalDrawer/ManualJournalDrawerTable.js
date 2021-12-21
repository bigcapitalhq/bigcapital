import React from 'react';

import { CommercialDocEntriesTable  } from 'components';
import { useManualJournalEntriesColumns } from './utils';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';

import { TableStyle } from '../../../common';

/**
 * Manual journal drawer table.
 */
export default function ManualJournalDrawerTable() {
  const columns = useManualJournalEntriesColumns();
  const { manualJournal } = useManualJournalDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={manualJournal.entries}
      styleName={TableStyle.Constrant}
    />
  );
}
