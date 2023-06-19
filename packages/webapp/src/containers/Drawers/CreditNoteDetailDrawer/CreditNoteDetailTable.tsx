// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';

import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';
import { useCreditNoteReadOnlyEntriesColumns } from './utils';

/**
 * Credit note detail table.
 * @returns {React.JSX}
 */
export default function CreditNoteDetailTable() {
  const {
    creditNote: { entries },
  } = useCreditNoteDetailDrawerContext();

  // Credit note entries table columns.
  const columns = useCreditNoteReadOnlyEntriesColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      className={'table-constraint'}
    />
  );
}
