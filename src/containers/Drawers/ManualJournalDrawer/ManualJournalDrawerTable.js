import React from 'react';

import { DataTable, If } from 'components';
import { useManualJournalEntriesColumns } from './utils';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';

/**
 * Manual journal drawer table.
 */
export default function ManualJournalDrawerTable() {
  const columns = useManualJournalEntriesColumns();
  const {
    manualJournal: { entries, description },
  } = useManualJournalDrawerContext();

  return (
    <div className="journal-drawer__content-table">
      <DataTable columns={columns} data={entries} />

      <If condition={description}>
        <p className={'desc'}>
          <b>Description</b>: {description}
        </p>
      </If>
    </div>
  );
}
